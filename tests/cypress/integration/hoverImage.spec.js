/* global describe, it, cy */

const ELEMENT_NAME = 'Hover Image'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page and checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vce-hover-image-container')
    cy.get('.vce-hover-image-wrapper')
    cy.get('.vce-hover-image-inner-front')
      .should('be.visible')
    cy.get('.vce-hover-image-inner-hover')
      .should('not.be.visible')
  })
})
