/* global describe, it, cy, before */

const ELEMENT_NAME = 'Sandwich Side Menu'

describe(ELEMENT_NAME, function () {
  before(() => {
    cy.exec('cd .. && bash hubtools/elements/cloneScript.sh sandwichSideMenu')
    cy.exec('cd .. && bash hubtools/elements/buildScript.sh sandwichSideMenu')
  })
  it('Adds element to the page and checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vce-sandwich-side-menu-open-button').click()
    cy.get('.vce-sandwich-side-menu-container')
      .should('have.attr', 'data-vcv-sandwich-side-menu-visible')
      .and('include', true)
  })
})
