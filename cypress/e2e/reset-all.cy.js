describe('Reset to initial state', () => {
  it('passes', () => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="transcription factor"]').click();
    cy.get('[data-cy="reset_all_gene_search"]').click();
    cy.get('[data-cy="main_input_gene_search"]').then($div => {
      expect($div).to.have.text('');
    });
  });
});
