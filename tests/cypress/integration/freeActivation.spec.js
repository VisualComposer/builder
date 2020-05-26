/* global describe, it, cy */

describe('Free activation test', function () {
  it('Activates the visual composer, after finish it de-activates license', function () {
    // Free license for tests:
    const freeLicense = '17bab301-6c57-4db6-904e-78bac2352b88'
    const activationPageSlug = '/wp-admin/admin.php?page=vcv-go-premium'

    cy.visit(activationPageSlug)
    cy.wait(100) // react.render
    cy.get('input[name="licenseKey"]').should('be.visible')
    cy.get('input[name="licenseKey"]').type(freeLicense)
    cy.get('.vcv-activation-input-button[type="submit"]').click()
    cy.wait(200)

    // Now there can be updates pending, if so need to wait till it finishes
    cy.createPage()
    cy.wait(200)
    cy.get('.vcv-ui-navbar-dropdown-trigger[title="Menu"]').click()
    cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element[title="Faq Toggle"]').should('be.visible')

    // try to download FREE element
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element[title="Faq Toggle"] .vcv-ui-item-add.vcv-ui-icon-download').click({ force: true })
    cy.wait(2000) // wait till download finishes

    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element[title="Faq Toggle"] .vcv-ui-item-add.vcv-ui-icon-add').click({ force: true })

    // deactivate license:
    // TODO:
  })
})
