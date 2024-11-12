/* eslint-disable testing-library/await-async-utils */
import { baseUrl } from "src/constants";

describe('Item creation, update, deletion, and dialog functionality', () => {
  const login = () => {
    cy.intercept('POST', `${baseUrl}/auth/login`, {
      statusCode: 200,
      body: {
        accessToken: 'sampleAccessToken',
        user: { username: 'validUsername' },
      },
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('input[name="username"]').type('validUsername');
    cy.get('input[name="password"]').type('validPassword');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
  };

  it('should open the dialog, submit a new item, and display it in the list', () => {
    login();

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' },
      ],
    }).as('fetchItems');

    cy.intercept('POST', `${baseUrl}/items`, (req) => {
      req.reply({
        statusCode: 201,
        body: { id: 3, name: 'New Item', description: 'Description for New Item' },
      });
    }).as('createItem');

    cy.visit('/home');
    cy.wait('@fetchItems');

    cy.get('.grid').children().should('have.length', 2);

    cy.get('button').contains('Add new item').click();
    cy.get('input[placeholder="Item Name"]').type('New Item');
    cy.get('textarea[placeholder="Item Description"]').type('Description for New Item');
    cy.get('button').contains('Create Item').click();

    cy.wait('@createItem');

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' },
        { id: 3, name: 'New Item', description: 'Description for New Item' },
      ],
    }).as('fetchItemsAfterCreation');

    cy.visit('/home');
    cy.wait('@fetchItemsAfterCreation');

    cy.get('.grid').children().should('have.length', 3);
    cy.get('.grid').children().last().should('contain', 'New Item').should('contain', 'Description for New Item');
  });

  it('should show validation error when name or description is empty', () => {
    login();

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' },
      ],
    }).as('fetchItems');

    cy.visit('/home');
    cy.wait('@fetchItems');

    cy.get('button').contains('Add new item').click();
    cy.get('button').contains('Create Item').click();
    cy.contains("Name and description can't be empty.").should('be.visible');
  });

  it('should delete an item when delete button is clicked', () => {
    login();

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' },
      ],
    }).as('fetchItems');

    cy.intercept('DELETE', `${baseUrl}/items/*`, (req) => {
      req.reply({
        statusCode: 200,
        body: {},
      });
    }).as('deleteItem');

    cy.visit('/home');
    cy.wait('@fetchItems');

    cy.get('.grid').children().should('have.length', 2);
    cy.get('.grid').children().first().find('button[aria-label="Delete"]').click();
    cy.get('.swal2-confirm').click();

    cy.wait('@deleteItem');

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
      ],
    }).as('fetchItemsAfterDeletion');

    cy.visit('/home');
    cy.wait('@fetchItemsAfterDeletion');
    cy.get('.grid').children().should('have.length', 1);
  });

  it('should update an item when update button is clicked and form is submitted', () => {
    login();

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' },
      ],
    }).as('fetchItems');

    cy.intercept('PATCH', `${baseUrl}/items/*`, (req) => {
      req.reply({
        statusCode: 200,
        body: { name: 'Updated Item', description: 'Updated description' },
      });
    }).as('updateItem');

    cy.visit('/home');
    cy.wait('@fetchItems');

    cy.get('.grid').children().first().find('button[aria-label="Edit"]').click();
    cy.get('input[placeholder="Item Name"]').clear().type('Updated Item');
    cy.get('textarea[placeholder="Item Description"]').clear().type('Updated description');
    cy.get('button').contains('Update Item').click();

    cy.wait('@updateItem');

    cy.intercept('GET', `${baseUrl}/items?join=user`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Updated Item', description: 'Updated description' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' },
      ],
    }).as('fetchItemsAfterUpdate');

    cy.visit('/home');
    cy.wait('@fetchItemsAfterUpdate');

    cy.get('.grid').children().should('have.length', 2);
    cy.get('.grid').children().first().should('contain', 'Updated Item').should('contain', 'Updated description');
  });
});
