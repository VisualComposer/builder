/* global describe, it, cy, Cypress */

describe('Hub', function () {
  it('Create page open hub and check is it not empty on non-activated version', function () {

    // Dump and clean database
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php?php-e2e=1&php-e2e-action=dump-vcv-db-start-clean')

    // Activate license
    const freeLicense = '17bab301-6c57-4db6-904e-78bac2352b88'
    const activationPageSlug = '/wp-admin/admin.php?page=vcv-go-premium'
    cy.visit(activationPageSlug)

    cy.wait(300) // react.render

    cy.get('input[name="licenseKey"]').should('be.visible')
    cy.get('input[name="licenseKey"]').type(freeLicense)
    cy.window().then((win) => {
      cy.route('POST', win.vcvAdminAjaxUrl).as('activationUrlClick')
    })
    cy.get('.vcv-activation-input-button[type="submit"]').click()
    cy.wait('@activationUrlClick')

    // Download teasers (non activated)
    cy.visit('/wp-admin/admin.php?page=vcv-update')
    cy.wait(1000)

    cy.createPage()
    cy.viewport(1200, 900)
    cy.wait(200)
    cy.get('.vcv-ui-navbar-control[title="Visual Composer Hub"]').click()
    // make sure that Hub is not empty!

    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser').should('be.visible')
    cy.get('.vcv-ui-item-element').should('be.visible')

    cy.contains('.vcv-ui-form-button', 'Elements').click()
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element').should('be.visible')
    cy.get('.vcv-ui-item-element[title="3 Color Button"] .vcv-ui-item-add.vcv-ui-icon-lock')

    cy.contains('.vcv-ui-form-button', 'Templates').click()
    cy.get('.vcv-ui-item-element').should('be.visible')
    cy.get('.vcv-ui-item-element[title="Fashion Leaflet"] .vcv-ui-item-add.vcv-ui-icon-lock')

    cy.contains('.vcv-ui-form-button', 'Blocks').click()
    cy.get('.vcv-ui-item-element').should('be.visible')
    cy.get('.vcv-ui-item-element[title="Call to Action Right"] .vcv-ui-item-add.vcv-ui-icon-lock')

    cy.contains('.vcv-ui-form-button', 'Addons').click()
    cy.get('.vcv-hub-addon-item-container').should('be.visible')
    cy.get('.vcv-hub-addon-item-container')
      .first()
      .find('.vcv-hub-addon-control')
      .contains('Available in Premium')

    cy.contains('.vcv-ui-form-button', 'Headers').click()
    cy.get('.vcv-ui-item-element').should('be.visible')
    cy.get('.vcv-ui-item-element[title="Basic Header"] .vcv-ui-item-add.vcv-ui-icon-lock')

    cy.contains('.vcv-ui-form-button', 'Footers').click()
    cy.get('.vcv-ui-item-element').should('be.visible')
    cy.get('.vcv-ui-item-element[title="Basic Footer"] .vcv-ui-item-add.vcv-ui-icon-lock')

    cy.contains('.vcv-ui-form-button', 'Sidebars').click()
    cy.get('.vcv-ui-item-element').should('be.visible')
    cy.get('.vcv-ui-item-element[title="Banner Sidebar"] .vcv-ui-item-add.vcv-ui-icon-lock')

    cy.contains('.vcv-ui-form-button', 'Stock Images').click()
    cy.contains('.vcv-stock-images-button', 'Activate Premium').should('be.visible')
    cy.wait(1500)
    cy.get('.vcv-stock-image-wrapper.vcv-stock-image--loaded')
      .first()
      .find('.vcv-ui-icon-lock')

    cy.contains('.vcv-ui-form-button', 'Elements').click()
    cy.get('.vcv-ui-form-input.vcv-ui-editor-search-field')
      .type('Icon')

    cy.window().then((win) => {
      cy.route('POST', win.vcvAdminAjaxUrl).as('downloadElement')
    })
    cy.get('.vcv-ui-item-element[title="Icon"] .vcv-ui-icon-download').click()
    cy.wait('@downloadElement')

    cy.get('.vcv-ui-item-element[title="Icon"] .vcv-ui-icon-add').click()
    cy.wait(300)
    cy.get('.vcv-ui-edit-form-header-title').contains('Icon')

    cy.savePage()
    cy.viewPage()

    // Revert back previous state OF DATABASE (licenses, hub, etc)
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php?php-e2e=1&php-e2e-action=dump-vcv-db-back')
  })
})
