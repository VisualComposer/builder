/* global describe, it, cy */

const ELEMENT_NAME = 'Shortcode'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/shortcode.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.window().then((window) => {
        cy.route('POST', window.vcvAjaxUrl).as('renderShortcode')
      })


      cy.get('.vcv-ui-form-input').first()
        .clear()
        .type(settings.shortcode)

      cy.wait('@renderShortcode')

      cy.get('.vcv-ui-form-group-heading')
        .contains('Element ID')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .type(settings.customId)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Extra class name')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .type(settings.customClass)
        })



      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.customId}`)
        .should('have.class', settings.customClass)
        .find('a')
        .should('have.attr', 'href', settings.embedHref)

    })
  })
})
