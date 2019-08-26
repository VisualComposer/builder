/* global describe, it, cy, expect */

const ELEMENT_NAME = 'Separator'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/separator.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.get('.vcv-ui-form-group-heading')
        .contains('Separator color')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
          cy.get('.vcv-ui-color-picker-custom-color input[value="BFC0C1"]')
            .clear()
            .type(settings.color.hex)
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Alignment')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-buttons-group')
            .find(`.vcv-ui-form-button[data-value="${settings.alignment}"]`)
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Style')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .select(settings.style)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Thickness')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(settings.thickness)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Separator width')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.width)
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

      cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.get('.vce-separator-container')
        .should('have.class', settings.customClass)
        .and('have.class', `vce-separator--style-${settings.style}`)
        .should('have.css', 'text-align', settings.alignment)
        .and('have.css', 'margin', settings.designOptions.margin)

      cy.get(`#${settings.customId}`)
        .should('have.css', 'border-radius', settings.designOptions.borderRadius)
        .and('have.css', 'border-width', settings.designOptions.borderWidth)
        .and('have.css', 'border-style', settings.designOptions.borderStyle)
        .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)
        .and('have.css', 'padding', settings.designOptions.padding)
        .and('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
        .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
        .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
        .and('have.attr', 'data-vcv-o-animated', 'true')
        .should('have.class', `vce-separator--width-${settings.width}`)
        .and('have.class', `vce-separator--thickness-${settings.thickness}`)
        .then(($el) => {
          const win = $el[0].ownerDocument.defaultView
          const before = win.getComputedStyle($el[0], 'before')
          const bordetTopStyleValue = before.getPropertyValue('border-top-style')
          const borderWidthValue = before.getPropertyValue('border-width')
          expect(bordetTopStyleValue).to.eq(settings.style)
          expect(borderWidthValue).to.eq(`${settings.thickness}px 0px 0px`)
        })
    })
  })
})
