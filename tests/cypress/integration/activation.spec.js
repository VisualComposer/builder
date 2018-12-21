/* global describe, it, cy */

describe('VCWB Activation test', function () {
  /*
  beforeEach(function () {
    // reset and seed the database prior to every test
    cy.exec('yarn build')
  })
  */
  it('Activates VCWB plugin with free license', function () {
    cy.on('window:confirm', str => true)
    cy.visit('/wp-login.php')
    cy.get('#user_login').type(Cypress.env('wpUserName'))
    cy.get('#user_pass').type(`${Cypress.env('wpPassword')}{enter}`)

    cy.visit('/wp-admin/plugins.php')

    cy.get(`[data-slug="${Cypress.env('slug')}"]`).then(($block) => {
      if ($block.hasClass('active')) {
        cy.get(`[data-slug="${Cypress.env('slug')}"] .deactivate a`).click()
        cy.get(`#vcv-visual-composer-website-builder a.vcv-deactivation-submit-button`).click()
      }
    })
    cy.get(`[data-slug="${Cypress.env('slug')}"] .activate a`).click()
    cy.visit('/wp-admin/admin.php?page=vcv-settings')
    cy.get('.vcv-settings-tab-content a').contains('initiate reset').click()
    cy.visit('/wp-admin/admin.php?page=vcv-getting-started')
    cy.get('.vcv-activation-button-container a.vcv-activation-button.vcv-activation-button--dark').click()
    // cy.get('a.vcv-basic-button.vcv-basic-button--dark.vcv-basic-button--full').click()
  })
})
