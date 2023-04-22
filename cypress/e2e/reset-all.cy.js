/* eslint-disable cypress/no-unnecessary-waiting */
describe('Reset to initial state', () => {
  it('passes', () => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000');

    // click example text
    cy.get('[data-cy="transcription factor"]').click();

    // expand screener
    cy.get('[data-cy="gene_search_screener"]').click();

    // set tau conditions
    cy.get('[data-cy="tau_group_0"]').within(() =>
      cy.get('select').select('humanFantom5Spec001')
    );

    cy.get('[data-cy="tau_cutoff_0"]').type('0.9');
    cy.get('[data-cy="tau_condition_0"]').within(() =>
      cy.get('select').select('gt')
    );

    // click search button
    cy.get('[data-cy="gene_find_results_button"]').click();

    // click the first symbol in index results
    cy.get('.results_wrapper')
      .first()
      .within(() => {
        cy.get('table').within(() => {
          cy.get('.text_with_icon').first().click();
        });
      });

    // click the first breadcrumb
    cy.get('.nav_item').first().click();

    // expand screener
    cy.get('[data-cy="gene_search_screener"]').click();
    // wait to see if the data presists in screener
    cy.wait(2000);

    // click reset all button
    cy.get('[data-cy="gene_search_reset_all"]').click();

    // check if the input field is empty
    cy.get('[data-cy="gene_search_main_input"]').then($div => {
      expect($div).to.have.text('');
    });
  });
});
