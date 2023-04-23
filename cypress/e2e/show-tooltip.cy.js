/// <reference types="Cypress" />
import 'cypress-real-events'; // work only in the chromium-based browser.

describe('Reset to initial state', () => {
  it('search, return to main and reset all', () => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000');

    // get screener title and store it
    cy.getBySel('gene_search_screener')
      .as('screener')
      .within(() => cy.get('.screener_title').as('screener_toggle'));
    cy.get('@screener_toggle').click();
    cy.get('@screener').within(() => {
      cy.get('.v-popper--has-tooltip').as('tooltips');
      cy.get('@tooltips').eq(1).realHover();
    });
    cy.get('.v-popper__inner').should('contain', 'This is Filter by');
  });
});
