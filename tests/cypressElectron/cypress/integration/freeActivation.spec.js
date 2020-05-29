/* global describe, it, cy */

describe('Free activation test', function () {
  it('Activates the visual composer, after finish it de-activates license', function () {
    // Free license for tests:
    const freeLicense = '17bab301-6c57-4db6-904e-78bac2352b88'
    const activationPageSlug = '/wp-admin/admin.php?page=vcv-go-premium'

    // Dump and clean database
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php?php-e2e=1&php-e2e-action=dump-vcv-db-start-clean')
    cy.visit(activationPageSlug)

    cy.wait(300) // react.render

    // Activate license
    cy.get('input[name="licenseKey"]').should('be.visible')
    cy.get('input[name="licenseKey"]').type(freeLicense)
    cy.window().then((win) => {
      cy.route('POST', win.vcvAdminAjaxUrl).as('activationUrlClick')
    })
    cy.get('.vcv-activation-input-button[type="submit"]').click()
    cy.wait('@activationUrlClick')

    // Download teasers
    cy.visit('/wp-admin/admin.php?page=vcv-update')
    cy.wait(1000)

    // Now there can be updates pending, if so need to wait till it finishes
    cy.createPage()
    cy.wait(200)
    cy.get('.vcv-ui-navbar-dropdown-trigger[title="Menu"]').click()
    cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
    cy.get('#add-element-search').type('Faq toggle')
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element[title="Faq Toggle"]').should('be.visible')

    // try to download FREE element
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element[title="Faq Toggle"] .vcv-ui-item-add.vcv-ui-icon-download').click({ force: true })
    // Wait for element download
    cy.wait('@loadContentRequest')
    cy.wait(2000) // additional wait for triggers/element.bundle.js load

    // Add element to page
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element[title="Faq Toggle"] .vcv-ui-item-add.vcv-ui-icon-add').click({ force: true })
    cy.setInput("Title text", 'Faq toggle from Hub')
    cy.setClassAndId('hub-faq-toggle-id', 'hub-faq-toggle-class')

    // Add from add element window to page
    cy.addElement('Faq Toggle')
    cy.setInput("Title text", 'Faq toggle from add element')
    cy.setClassAndId('add-element-faq-toggle-id', 'add-element-faq-toggle-class')

    // Test added element
    cy.savePage()
    cy.viewPage()
    cy.get(`#hub-faq-toggle-id`).should('have.class', 'hub-faq-toggle-class')
    cy.get(`#add-element-faq-toggle-id`).should('have.class', 'add-element-faq-toggle-class')
    cy.get(`#hub-faq-toggle-id`).contains('Faq toggle from Hub').should('be.visible')
    cy.get(`#add-element-faq-toggle-id`).contains('Faq toggle from add element').should('be.visible')

    // Revert back previous state OF DATABASE (licenses, hub, etc)
    cy.visit('/wp-content/plugins/' + Cypress.env('dataPlugin').replace('/plugin-wordpress.php', '') + '/tests/php-e2e-actions/init.php?php-e2e=1&php-e2e-action=dump-vcv-db-back')
  })
})
