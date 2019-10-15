/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Google Fonts Heading'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/googleFontsHeading.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.get('.vcv-ui-form-group-heading')
        .contains('Title text')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(settings.titleText)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Font Family')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-dropdown')
            .select(settings.fontFamily)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Font Style')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-dropdown')
            .select(settings.fontStyle)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Element tag')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .select(settings.elementTag)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Gradient overlay type')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .select(settings.gradientOverlayType)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Start color')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
          cy.get('.vcv-ui-color-picker-custom-color input[value="FF7200"]')
            .clear()
            .type(settings.startColor.hex)
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('End color')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
          cy.get('.vcv-ui-color-picker-custom-color input[value="5C00FF"]')
            .clear()
            .type(settings.endColor.hex)
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Gradient angle')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.gradientAngle)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Font size')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(settings.fontSize)
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
        .contains('Line height')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(settings.lineHeight)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Letter spacing')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(settings.letterSpacing)
        })

      cy.get('.vcv-ui-form-link-button').click()
      cy.get('.vcv-ui-modal .vcv-ui-form-group-heading')
        .contains('URL')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-editor-dropdown-input-container')
            .find('input')
            .type(settings.linkSelection)
        })
      cy.get('.vcv-ui-modal .vcv-ui-modal-action').click()

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

      cy.get(`#${settings.customId}`)
        .should('have.class', settings.customClass)
        .should('have.css', 'text-align', settings.alignment)

      cy.get('.vce-google-fonts-heading--background')
        .should('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
        .and('have.css', 'padding', settings.designOptions.padding)
        .and('have.css', 'margin', settings.designOptions.margin)
        .and('have.css', 'border-radius', settings.designOptions.borderRadius)
        .and('have.css', 'border-width', settings.designOptions.borderWidth)
        .and('have.css', 'border-style', settings.designOptions.borderStyle)
        .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)
        .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
        .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
        .and('have.attr', 'data-vcv-o-animated', 'true')

      cy.get(`${settings.elementTag}.vce-google-fonts-heading-inner`)
        .should('have.css', 'font-size', `${settings.fontSize}px`)
        .and('have.css', 'line-height', settings.lineHeight)
        .and('have.css', 'font-family', settings.fontFamily)
        .and('have.css', 'font-weight', settings.fontStyle.match(/\d+/)[0])
        .and('have.css', 'background-image', `linear-gradient(${settings.gradientAngle}deg, ${settings.startColor.rgb}, ${settings.endColor.rgb})`)
        .find('a')
        .contains(settings.titleText)
        .should('have.attr', 'href', `http://${settings.linkSelection}`)
        .and('have.attr', 'target', '_blank')

      if (Cypress.env('checkSnapshots')) {
        cy.wait(2000)
        cy.get(`#${settings.customId}`).matchImageSnapshot({ blur: 1 })
      }
    })
  })
})
