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
    cy.get('.v-popper--has-tooltip').as('tooltips');
    // cy.get('@tooltips').each(($el, index, $list) => {
    //   cy.wrap($el).realHover();
    //   cy.document().its('body').should('contain', 'This is Filter by');
    //   cy.document().its('body').children('.v-popper__popper').invoke('remove');
    //   // refer body which is outside of the screener
    //   // cy.wait(2000);
    //   cy.get('body').realHover({ position: 'topLeft' });
    // });
    cy.getBySel('tpm_filter').find('svg').first().realHover();
    cy.get('.v-popper__popper').should('contain', 'This is Filter by');
    // removed the hover tooltip otherwise it will persist
    cy.get('.v-popper__popper').invoke('remove');
    cy.getBySel('roku_filter').find('.v-popper--has-tooltip').eq(2).realHover();
    cy.get('.v-popper__popper').should('contain', 'Range');
    cy.get('.v-popper__popper').invoke('remove');
    // cy.document().its('body').should('contain', 'This is Filter by');
    // cy.get('body').realHover({ position: 'topLeft' });
    // cy.getBySel('roku_filter').find('svg').realHover();
    // cy.document().its('body').should('contain', 'This is Filter by');
    // cy.get('body').realHover({ position: 'topLeft' });
  });
});
