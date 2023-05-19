/// <reference types="Cypress" />
import 'cypress-real-events'; // work only in the chromium-based browser.

describe('Reset to initial state', () => {
  it('search, return to main and reset all', () => {
    cy.viewport(1280, 1440);
    cy.visit('http://localhost:3000');

    // get screener title and store it
    cy.getBySel('gene_search_screener')
      .as('screener')
      .within(() => cy.get('.screener_title').as('screener_toggle'));
    cy.get('@screener_toggle').click();
    cy.get('.v-popper--has-tooltip').as('tooltips');
    cy.get('@tooltips').each(($el, index, $list) => {
      cy.wrap($el).realHover();
      if ($el.attr('data-cy') === 'filter_tooltip') {
        cy.document()
          .its('body')
          .children('.v-popper__popper')
          .should('contain', 'This is Filter by');
      }
      if ($el.attr('data-cy') === 'entropy_tooltip') {
        cy.document()
          .its('body')
          .children('.v-popper__popper')
          .should('contain', 'Range');
      }
      // removed the hover tooltip otherwise it will persist
      cy.get('.v-popper__popper').invoke('remove');
    });
  });
});
