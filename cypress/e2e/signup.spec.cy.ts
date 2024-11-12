/* eslint-disable testing-library/await-async-utils */
import { baseUrl } from "src/constants";

describe('SignUpComponent E2E Test', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should display the sign-up page elements', () => {
    cy.get('h1').should('contain', 'Sign Up');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmPassword"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('a').contains('Already have an account? Login here.').should('exist');
  });

  it('should show error for password mismatch', () => {
    cy.get('input[name="username"]').type('newUser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password1234');
    cy.get('button[type="submit"]').click();

    cy.contains('Passwords do not match. Please try again.').should('be.visible');
  });

  it('should sign up successfully and redirect to login page', () => {
    cy.intercept('POST', `${baseUrl}/auth/signup`, {
      statusCode: 200,
      body: { message: 'User created successfully' },
    }).as('signupRequest');

    cy.get('input[name="username"]').type('username');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@signupRequest');
    cy.url().should('include', '/login');
  });

  it('should show error for existing user during sign-up', () => {
    cy.intercept('POST', `${baseUrl}/auth/signup`, (req) => {
      req.reply({
        statusCode: 400,
        body: {
          message: "Username already exists",
          error: "Bad Request",
          statusCode: 400
        }
      });
    }).as('signupRequest');

    cy.get('input[name="username"]').type('existingUser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@signupRequest');
    cy.contains('Username already exists.', { timeout: 2000 }).should('be.visible');
  });

  it('should show error for network issues during sign-up', () => {
    cy.intercept('POST', `${baseUrl}/auth/signup`, {
      forceNetworkError: true,
    }).as('signupRequest');

    cy.get('input[name="username"]').type('newUser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@signupRequest');
    cy.contains('Network error. Please check your connection.').should('be.visible');
  });
});
