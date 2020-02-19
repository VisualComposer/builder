/* global describe, it, cy */

describe('Hub Panel', function () {
  it('Opens Hub panel, downloads element, adds element', function () {
    cy.fixture('../fixtures/hubPanel.json').then((settings) => {
      cy.viewport(1024, 700)
      cy.createPage()

      cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
      cy.get('.vcv-layout-bar-content.vcv-ui-state--visible #vcv-editor-end')
      cy.get('.vcv-ui-item-list-item')
        .its('length')
        .should('not.be.eq', 0)

      cy.get('#add-element-search')
        .type('Hero Section')

      cy.get('.vcv-ui-item-list-item')
        .its('length')
        .should('not.be.eq', 1)

      cy.contains('.vcv-ui-item-element', 'Hero Section')

      cy.get('.vcv-layout-bar-content-hide[title="Close"]')
        .click()

      cy.get('.vcv-layout-bar-content.vcv-ui-state--visible #vcv-editor-end')
        .should('not.be.visible')

      // cy.savePage()
      // cy.viewPage()


    })
  })
})
