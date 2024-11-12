/* eslint-disable testing-library/await-async-utils */
import { baseUrl } from "src/constants";

describe('Home Component Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', `${baseUrl}/auth/login`, {
      statusCode: 200,
      body: {
        accessToken: 'sampleAccessToken',
        user: { username: 'validUsername' },
      },
    }).as('loginRequest');

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Item 1', description: 'Description for Item 1', createdAt: '2024-11-01T12:00:00Z', updatedAt: '2024-11-02T12:00:00Z' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2', createdAt: '2024-11-03T12:00:00Z', updatedAt: '2024-11-04T12:00:00Z' },
      ],
    }).as('fetchItems');
    
    cy.visit('/login');
    cy.get('input[name="username"]').type('validUsername');
    cy.get('input[name="password"]').type('validPassword');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
  });

  it('should login successfully, redirect to home page, and display items', () => {
    cy.url().should('include', '/home');
    cy.get('h1').should('contain', 'Welcome, validUsername');
    cy.wait('@fetchItems');
    cy.get('.grid').should('exist');
    cy.get('.grid').children().should('have.length', 2);
  });

  it('should display "no items added" message when there are no items', () => {
    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [],
    }).as('fetchEmptyItems');
    
    cy.visit('/home');
    cy.wait('@fetchEmptyItems');
    cy.contains('No items found. Click "Add new item" to add a new item.').should('be.visible');
  });

  it('should render the logout button and display confirmation prompt on click', () => {
    cy.get('button[aria-label="Logout"]').should('exist');
    cy.get('button[aria-label="Logout"]').click();
    cy.get('.swal2-title').should('contain', 'Are you sure?');
    cy.get('.swal2-confirm').should('contain', 'Yes, log out!');
  });

  it('should confirm logout and redirect to login page', () => {
    cy.get('button[aria-label="Logout"]').click();
    cy.get('.swal2-confirm').click(); // Click "Yes, log out!" in SweetAlert

    cy.url().should('include', '/login');
  });

  it('should display item list inside a bordered container', () => {
    cy.wait('@fetchItems');
    cy.get('.bg-light-gray').should('exist');
    cy.get('.bg-light-gray').find('.grid').children().should('have.length', 2);
  });

  it('should show the correct username in the greeting message', () => {
    cy.get('h1').should('contain', 'Welcome, validUsername');
  });

  it('should display the current date', () => {
    cy.get('span.text-sm').should('not.be.empty');
  });
});
