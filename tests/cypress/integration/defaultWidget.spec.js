/* global describe, it, cy */

const ELEMENT_NAME = 'WordPress Default Widget'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/defaultWidget.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.window().then((window) => {
        cy.route('POST', window.vcvAjaxUrl).as('getWidget')
      })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Widget')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .select(settings.widgetType)
        })

      cy.wait('@getWidget')

      cy.get('#widget-form-1-text')
        .then(($field) => {
          cy.wrap($field)
            .clear()
            .type(settings.widgetText)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Enable custom widget HTML')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-switch-container')
            .find('.vcv-ui-form-switch')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Before Title html')

      cy.get('.vcv-ui-form-group-heading')
        .contains('After Title html')

      cy.get('.vcv-ui-form-group-heading')
        .contains('Before Widget html')

      cy.get('.vcv-ui-form-group-heading')
        .contains('After Widget html')

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

      cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.get('.vce-widgets-container')
        .should('have.class', settings.customClass)
        .should('have.attr', 'id', settings.customId)

      cy.get('.vce-widgets-wrapper')
        .should('have.css', 'border-radius', settings.designOptions.borderRadius)
        .and('have.css', 'border-width', settings.designOptions.borderWidth)
        .and('have.css', 'border-style', settings.designOptions.borderStyle)
        .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)
        .and('have.css', 'padding', settings.designOptions.padding)
        .and('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
        .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
        .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
        .and('have.attr', 'data-vcv-o-animated', 'true')

      cy.wait(200)
      cy.get('.textwidget p')
        .contains(settings.widgetText)
    })
  })
})
