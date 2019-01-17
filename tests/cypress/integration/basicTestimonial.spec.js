/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Basic Testimonial'

describe('Sandwich Side Menu', function () {
  it('Adds element to the page and checks attributes', function () {
    cy.visit('/wp-login.php')
    cy.wait(100)
    cy.server()
    cy.get('#user_login').type(Cypress.env('wpUserName'))
    cy.get('#user_pass').type(`${Cypress.env('wpPassword')}{enter}`)

    cy.visit(Cypress.env('newPage'))
    cy.window().then((win) => {
      cy.route('POST', win.vcvAdminAjaxUrl).as('loadContentRequest')
    })
    cy.wait('@loadContentRequest')

    cy.get('.vcv-ui-navbar-control[title="Add Element"]').click()
    cy.get(`.vcv-ui-item-element[title="${ELEMENT_NAME}"]`).click()
    cy.get('.vcv-ui-edit-form-header-title').contains(ELEMENT_NAME)
    cy.window().then((win) => {
      cy.route('POST', win.vcvAdminAjaxUrl).as('saveRequest')
    })
    cy.get('.vcv-ui-navbar-control[title="Publish"]').click()
    cy.wait('@saveRequest')

    cy.get('.vcv-ui-navbar-control[title="View Page"]')
      .should('have.attr', 'data-href')
      .then((href) => {
        cy.visit(href)
      })

    cy.get('.vce-basic-testimonial')
    cy.get('.vce-basic-testimonial-content')
    cy.get('.vce-basic-testimonial-image')
    cy.get('.vce-basic-testimonial-title')
    cy.get('.vce-basic-testimonial-author')
    cy.get('.vce-basic-testimonial-author-title')
  })
})
