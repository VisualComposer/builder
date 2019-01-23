/* global describe, it, cy */

const ELEMENT_NAME = 'Row'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vce-row')
      .should('have.attr', 'id')

    cy.get('.vce-col')
      .should('have.attr', 'id')
  })
})
