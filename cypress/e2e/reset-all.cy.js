/// <reference types="Cypress" />
/* eslint-disable cypress/no-unnecessary-waiting */
describe('Reset to initial state', () => {
  it('search, return to main and reset all', () => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000');

    // click example text
    cy.getBySel('gene_search_example_0').click();
    cy.getBySel('gene_search_main_input').clear();
    // type in input
    cy.getBySel('gene_search_main_input').type('transcription fac');
    cy.getBySel('gene_search_main_input').blur();
    // cy.wait(2000);

    // get screener title and store it
    cy.getBySel('gene_search_screener').within(() =>
      cy.get('.screener_title').as('screener_toggle')
    );
    cy.get('@screener_toggle').click();

    // set tau conditions (select element within element)
    cy.getBySel('tau_group_0').within(() =>
      cy.get('select').select('humanFantom5Spec001')
    );

    cy.getBySel('tau_cutoff_0').type('0.9');

    // select option
    cy.getBySel('tau_condition_0').within(() => cy.get('select').select('gt'));

    // click search button
    cy.getBySel('gene_find_results_button').click();

    // click the third symbol in index results
    cy.getBySel('gene_results_index_tbody').within(() =>
      cy.get('tr').eq(2).as('result')
    );
    cy.get('@result').within(() => cy.get('.symbol').click());

    // click the first breadcrumb
    cy.get('.nav_item').first().click();

    // expand screener
    cy.get('@screener_toggle').click();
    // wait to see if the data persists in screener
    cy.wait(2000);

    // click reset all button
    cy.getBySel('gene_search_reset_all').click();

    // check if the input field is empty
    cy.getBySel('gene_search_main_input').should('have.text', '');
  });
});
