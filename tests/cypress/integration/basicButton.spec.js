/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Basic Button'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/basicButton.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.get('.vcv-ui-form-group-heading')
        .contains('Button text')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(settings.buttonText)
        })

      cy.get('.vcv-ui-form-link-button').click()
      cy.get('.vcv-ui-modal .vcv-ui-form-group-heading')
        .contains('URL')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-editor-dropdown-input-container')
            .find('input')
            .type(settings.buttonLink)
        })
      cy.get('.vcv-ui-modal label[for="targetBlank-0-1"]').click()
      cy.get('.vcv-ui-modal .vcv-ui-modal-action').click()
      cy.get('.vcv-ui-form-group-heading')
        .contains('Alignment')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-buttons-group')
            .find(`.vcv-ui-form-button[data-value="${settings.alignment}"]`)
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Shape')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-buttons-group')
            .find('.vcv-ui-form-button[data-value="rounded"]')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Size')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-buttons-group')
            .find('.vcv-ui-form-button[data-value="small"]')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Stretch button')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-switch-container')
            .find('.vcv-ui-form-switch')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Title color')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
          cy.get('.vcv-ui-color-picker-custom-color input[value="FFFFFF"]')
            .clear()
            .type(settings.titleColor.hex)
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Background color')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
          cy.get('.vcv-ui-color-picker-custom-color input[value="557CBF"]')
            .clear()
            .type(settings.backgroundColor.hex)
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
        })

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

      cy.get('.vcv-ui-form-group-heading')
        .contains('Animate')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .select('bounce')
        })

      cy.savePage()
      cy.viewPage()

      cy.get('.vce-button--style-basic-container')
        .should('have.class', settings.customClass)
        .should('have.css', 'text-align', settings.alignment)

      cy.get('.vce-button--style-basic-wrapper--stretched')
        .should('have.css', 'width')

      cy.get(`#${settings.customId}`)
        .contains(settings.buttonText)
        .should('have.css', 'border-radius', '5px')
        .and('have.css', 'padding', '10px 30px')
        .and('have.css', 'color', settings.titleColor.rgb)
        .and('have.css', 'background-color', settings.backgroundColor.rgb)
        .and('have.css', 'animation-name', 'vce-o-animate--bounce')
        .should('have.attr', 'data-vce-animate', 'vce-o-animate--bounce')
        .and('have.attr', 'data-vcv-o-animated', 'true')
        .and('have.attr', 'href', `http://${settings.buttonLink}`)
        .and('have.attr', 'target', '_blank')

      if (Cypress.env('checkSnapshots')) {
        cy.wait(2000)
        cy.get(`#${settings.customId}`).matchImageSnapshot()
      }
    })
  })
})
