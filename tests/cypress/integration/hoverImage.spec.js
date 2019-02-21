/* global describe, it, cy, before */

const ELEMENT_NAME = 'Hover Image'

describe(ELEMENT_NAME, function () {
  before(() => {
    cy.exec('cd .. && bash hubtools/elements/cloneScript.sh hoverImage')
    cy.exec('cd .. && bash hubtools/elements/buildScript.sh hoverImage')
  })
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
