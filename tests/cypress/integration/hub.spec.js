/* global describe, it, cy */

describe('Hub', function () {
  it('Create page open hub and check is it not empty on non-activated version', function () {
    cy.createPage()
    cy.wait(200)
    cy.get('.vcv-ui-navbar-dropdown-trigger[title="Menu"]').click()
    cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
    // make sure that Hub is not empty!

    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser').should('be.visible')
    cy.get('.vcv-ui-editor-plates-container.vcv-ui-editor-plate--teaser .vcv-ui-item-element').should('be.visible')
  })
})
