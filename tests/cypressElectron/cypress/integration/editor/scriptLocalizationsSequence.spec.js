/* global describe, it, cy */

describe('php script localizations sequence', function () {
  it('Uses php-e2e-actions to load page with custom script localizations', function () {
    const actionPage = 'test-asset-enqueue'
    // http://127.0.0.1:8000/wp-content/plugins/visualcomposer/tests/php-e2e-actions/init.php/?php-e2e=1&php-e2e-action=test-asset-enqueue
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php/?php-e2e=1&php-e2e-action=' + actionPage)

    // Test:
    // Check is the vcvLocaleBug variable outputted in correct order and with correct value
    cy.get('#e2e-current-id')
      .then((element) => {
        cy.window().then((window) => {
          expect(window.vcvLocaleBug.test).to.equal(element.text())
        })
      })

    // Clean the DB:
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php/?php-e2e=1&php-e2e-action=clean-e2e-posts-db')
    // Make sure DB clean was success
    cy.window().then((window) => {
      expect('Done').to.equal(window.document.body.textContent)
    })
  })
})
