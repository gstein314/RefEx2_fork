/// <reference types="Cypress" />
describe('Reset to initial state', () => {
  it('search, return to main and reset all', () => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000');

    // get find button and store it
    cy.getBySel('gene_find_results_button').as('search');
    cy.getBySel('gene_search_reset_all_button').as('reset_all');
    cy.getBySel('gene_results_download_button').as('download');

    // assertion: check button effect
    cy.get('@search').should('be.disabled');
    cy.get('@reset_all').should('be.disabled');
    cy.get('@download').should('be.disabled');

    // click example text
    cy.getBySel('gene_search_example_0').click();
    // get input and store it
    cy.getBySel('gene_search_main_input').as('main_input');
    // empty input
    cy.get('@main_input').clear();
    // type text in input
    cy.get('@main_input').type('transcription fac');
    // blur input
    cy.get('@main_input').blur();

    // assertion: check button effect
    cy.get('@search').should('not.be.disabled');
    cy.get('@reset_all').should('not.be.disabled');
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

    // select dropdown option
    cy.getBySel('tau_condition_0').within(() => cy.get('select').select('gt'));

    cy.get('@search').click();

    cy.get('@download').should('not.be.disabled');

    // get the third result in tbody and store it
    cy.getBySel('gene_results_index_tbody').within(() =>
      cy.get('tr').eq(2).as('result')
    );
    // get the symbol of the third result and click it
    cy.get('@result').within(() => cy.get('.symbol').click());

    // click the first breadcrumb
    cy.get('.nav_item').first().click();

    // expand screener
    cy.get('@screener_toggle').click();

    cy.get('@reset_all').click();

    // assertions
    // all inputs should be empty
    cy.get('input').should('have.value', '');
    cy.get('@search').should('be.disabled');
    cy.get('@reset_all').should('be.disabled');
    cy.get('button.reset_btn').should('be.disabled');
    cy.get('@reset_all').should('be.disabled');
  });
});
