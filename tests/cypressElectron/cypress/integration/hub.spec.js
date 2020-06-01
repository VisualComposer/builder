/* global describe, it, cy */

describe('Hub', function () {
  it('Create page open hub and check is it not empty on non-activated version', function () {
    // Dump and clean database
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php?php-e2e=1&php-e2e-action=dump-vcv-db-start-clean')

    // Download teasers (non activated)
    cy.visit('/wp-admin/admin.php?page=vcv-update')
    cy.wait(1000)

    cy.createPage()
    cy.viewport(800, 800)
    cy.wait(200)
    cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
    // make sure that Hub is not empty!

    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser').should('be.visible')
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element').should('be.visible')

    // Revert back previous state OF DATABASE (licenses, hub, etc)
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php?php-e2e=1&php-e2e-action=dump-vcv-db-back')
  })
})
