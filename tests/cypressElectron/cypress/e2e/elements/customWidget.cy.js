/* global describe, it, cy */

const ELEMENT_NAME = 'WordPress Custom Widget'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/customWidget.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      // 1. Set attributes and DO
      cy.setSwitch('Enable custom widget HTML')
      cy.get('.vcv-ui-form-group-heading')
        .contains('Before "Title" HTML')
      cy.get('.vcv-ui-form-group-heading')
        .contains('After "Title" HTML')
      cy.setCodeMirror(settings.beforeWidgetHTML)
      cy.setCodeMirror(settings.afterWidgetHTML)

      cy.setClassAndId(settings.customId, settings.customClass)
      // cy.setDO(settings.designOptions)

      // 2. Set widget and widget content
      cy.window().then((window) => {
        cy.intercept('POST', window.vcvAjaxUrl).as('getWidget')
      })
      cy.setSelect('Widget', settings.widgetType)
      cy.wait('@getWidget')
      cy.get('#widget-form-1-content')
        .then(($field) => {
          cy.wrap($field)
            .clear()
            .type(settings.widgetHTML)
        })

      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.customId}`)
        .should('have.class', settings.customClass)

      // Disable DO check for performance
      // cy.get('.vce-widgets-wrapper')
      //   .should('have.css', 'border-radius', settings.designOptions.borderRadius)
      //   .and('have.css', 'border-width', settings.designOptions.borderWidth)
      //   .and('have.css', 'border-style', settings.designOptions.borderStyle)
      //   .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)
      //   .and('have.css', 'padding', settings.designOptions.padding)
      //   .and('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
      //   .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
      //   .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
      //   .and('have.attr', 'data-vcv-o-animated', 'true')

      cy.wait(200)
      cy.contains('.textwidget h1', settings.widgetText)

      cy.contains(settings.beforeWidgetHTML.selector, settings.beforeWidgetHTML.textString)
      cy.contains(settings.afterWidgetHTML.selector, settings.afterWidgetHTML.textString)
    })
  })
})
