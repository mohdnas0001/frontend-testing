/* eslint-disable testing-library/await-async-utils */

import { baseUrl } from "src/constants";



describe('LoginComponent E2E Test', () => {
  beforeEach(() => {
    cy.visit('/login'); // Adjust the URL to where your LoginComponent is located
  });

  it('should display the login page elements', () => {
    cy.get('h1').should('contain', 'Login');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('a').contains('Already have an account? Login here.').should('exist');
  });

  it('should show error for incorrect password', () => {
    cy.intercept('POST', `${baseUrl}/auth/login`, {
      statusCode: 401,
      body: { message: 'Invalid password' },
    }).as('loginRequest');

    cy.get('input[name="username"]').type('validUsername');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('Invalid password. Please try again.').should('be.visible');
  });

  it('should show error for user not found', () => {
    cy.intercept('POST', `${baseUrl}/auth/login`, {
      statusCode: 404,
      body: { message: 'User not found' },
    }).as('loginRequest');

    cy.get('input[name="username"]').type('nonExistentUser');
    cy.get('input[name="password"]').type('somePassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('User not found. Please check your username.').should('be.visible');
  });

  it('should show error for network issues', () => {
    cy.intercept('POST', `${baseUrl}/auth/login`, {
      forceNetworkError: true,
    }).as('loginRequest');

    cy.get('input[name="username"]').type('validUsername');
    cy.get('input[name="password"]').type('validPassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('Network error. Please check your connection.').should('be.visible');
  });

     it('should toggle password visibility when the eye icon is clicked', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password'); // Initial password input type is "password"
    cy.get('button[aria-label="Toggle password visibility"]').click(); // Click to show password
    cy.get('input[name="password"]').should('have.attr', 'type', 'text'); // Password input type should be "text"
    cy.get('button[aria-label="Toggle password visibility"]').click(); // Click to hide password
    cy.get('input[name="password"]').should('have.attr', 'type', 'password'); // Password input type should revert to "password"
     });
    
  it('should login successfully and redirect to home page', () => {
    cy.intercept('POST', `${baseUrl}/auth/login`, {
      statusCode: 200,
      body: {
        accessToken: 'sampleAccessToken',
        user: { username: 'validUsername' },
      },
    }).as('loginRequest');

    cy.get('input[name="username"]').type('validUsername');
    cy.get('input[name="password"]').type('validPassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/home');
  });
});
