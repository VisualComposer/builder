/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Google Fonts Heading'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/googleFontsHeading.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      cy.setInput('Title text', settings.titleText)

      // Font Family and Font Style both have a div wrapper around select element,
      // can't use cy.setSelect command.
      cy.get('.vcv-ui-form-group-heading')
        .contains('Font family')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-dropdown')
            .select(settings.fontFamily)
        })
      cy.wait(500)
      cy.get('.vcv-ui-form-group-heading')
        .contains('Font style')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-dropdown')
            .select(settings.fontStyle)
        })
      cy.setSelect('Element tag', settings.elementTag)
      cy.setSelect('Gradient overlay type', settings.gradientOverlayType)
      cy.setColor(settings.startColor)
      cy.setColor(settings.endColor)

      cy.get('.vcv-ui-form-group-heading-wrapper')
        .contains('Gradient angle')
        .then(($field) => {
          cy.wrap($field)
            .parent()
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.gradientAngle)
        })

      cy.setInput('Font size', settings.fontSize)
      cy.setButtonGroup('Alignment', settings.alignment)
      cy.setInput('Line height', settings.lineHeight)
      cy.setInput('Letter spacing', settings.letterSpacing)
      cy.setURL('Link selection', settings.linkSelection)
      cy.setClassAndId(settings.customId, settings.customClass)
      // cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.customId}.${settings.customClass}`)
        .should('have.css', 'text-align', settings.alignment)

      // Disable DO check for performance
      // cy.get('.vce-google-fonts-heading--background')
      //   .should('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
      //   .and('have.css', 'padding', settings.designOptions.padding)
      //   .and('have.css', 'margin', settings.designOptions.margin)
      //   .and('have.css', 'border-radius', settings.designOptions.borderRadius)
      //   .and('have.css', 'border-width', settings.designOptions.borderWidth)
      //   .and('have.css', 'border-style', settings.designOptions.borderStyle)
      //   .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)
      //   .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
      //   .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
      //   .and('have.attr', 'data-vcv-o-animated', 'true')

      cy.get(`${settings.elementTag}.vce-google-fonts-heading-inner`)
        .should('have.css', 'font-size', `${settings.fontSize}px`)
        .and('have.css', 'line-height', settings.lineHeight)
        .and('have.css', 'font-family', settings.fontFamily)
        .and('have.css', 'font-weight', settings.fontStyle.match(/\d+/)[0])
        .and('have.css', 'background-image', `linear-gradient(${settings.gradientAngle}deg, ${settings.startColor.valueRGB}, ${settings.endColor.valueRGB})`)
        .find('a')
        .contains(settings.titleText)
        .should('have.attr', 'href', `http://${settings.linkSelection.url}`)

      if (Cypress.env('checkSnapshots')) {
        cy.wait(2000)
        cy.get(`#${settings.customId}`).matchImageSnapshot({ blur: 2 })
      }
    })
  })
})
