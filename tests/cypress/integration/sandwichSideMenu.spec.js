/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Sandwich Side Menu'

describe('Sandwich Side Menu', function () {
  it('Adds element to the page and checks attributes', function () {
    cy.visit('/wp-login.php')
    cy.wait(100)
    cy.get('#user_login').type(Cypress.env('wpUserName'))
    cy.get('#user_pass').type(`${Cypress.env('wpPassword')}{enter}`)

    cy.visit(Cypress.env('newPage'))
    cy.wait(1200)

    cy.get('.vcv-ui-navbar-control[title="Add Element"]').click()
    cy.get(`.vcv-ui-item-element[title="${ELEMENT_NAME}"]`).click()
    cy.get('.vcv-ui-edit-form-header-title').contains(ELEMENT_NAME)
    cy.get('.vcv-ui-navbar-control[title="Publish"]').click()
    cy.wait(2100)

    cy.get('.vcv-ui-navbar-control[title="View Page"]')
      .should('have.attr', 'data-href')
      .then((href) => {
        cy.visit(href)
      })

    cy.get('.vce-sandwich-side-menu-open-button').click()
    cy.get('.vce-sandwich-side-menu-container')
      .should('have.attr', 'data-vcv-sandwich-side-menu-visible')
      .and('include', true)
  })
})
