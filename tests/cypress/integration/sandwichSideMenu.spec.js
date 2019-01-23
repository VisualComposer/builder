/* global describe, it, cy */

const ELEMENT_NAME = 'Sandwich Side Menu'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page and checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vce-sandwich-side-menu-open-button').click()
    cy.get('.vce-sandwich-side-menu-container')
      .should('have.attr', 'data-vcv-sandwich-side-menu-visible')
      .and('include', true)
  })
})
