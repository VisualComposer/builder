/* global describe, it, cy */

const ELEMENT_NAME = 'Basic Testimonial'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page and checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vce-basic-testimonial')
    cy.get('.vce-basic-testimonial-content')
    cy.get('.vce-basic-testimonial-image')
    cy.get('.vce-basic-testimonial-title')
    cy.get('.vce-basic-testimonial-author')
    cy.get('.vce-basic-testimonial-author-title')
  })
})
