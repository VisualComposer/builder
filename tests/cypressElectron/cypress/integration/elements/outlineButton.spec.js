/* global describe, it, cy */

const ELEMENT_NAME = 'Outline Button'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/outlineButton.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.setInput('Button text', settings.buttonText)
      cy.setURL('Link selection', settings.buttonLink)
      cy.setButtonGroup('Alignment', settings.alignment)
      cy.setButtonGroup('Shape', settings.shape.name)
      cy.setButtonGroup('Size', settings.size.name)
      cy.setSwitch('Stretch')
      cy.setColor(settings.titleColor)
      cy.setColor(settings.borderColor)
      cy.setClassAndId(settings.customId, settings.customClass)

      cy.savePage()
      cy.viewPage()

      cy.get(`.${settings.customClass}.vce-button--style-outline-container--align-${settings.alignment}`)
        .should('have.css', 'text-align', settings.alignment)

      cy.get('.vce-button--style-outline-wrapper--stretched')
        .then((element) => {
          let contentContainerWidth
          cy.window().then((window) => {
            const contentContainer = window.document.querySelector( '.vce-row')
            contentContainerWidth = window.getComputedStyle(contentContainer).width
            cy.wrap(element)
              .should('have.css', 'width', contentContainerWidth)
          })
        })

      cy.get(`#${settings.customId}`)
        .then($el => {
          const win = $el[0].ownerDocument.defaultView
          const before = win.getComputedStyle($el[0], 'before')
          const contentValue = before.getPropertyValue('border-color')
          expect(contentValue).to.eq(settings.borderColor.valueRgb)

          cy.wrap($el)
            .should('have.css', 'border-radius', settings.shape.cssValue)
            .and('have.css', 'padding', settings.size.cssValue)
            .and('have.css', 'color', settings.titleColor.valueRgb)
            .and('have.attr', 'href', `http://${settings.buttonLink.url}`)
            .and('have.attr', 'target', '_blank')
            .contains(settings.buttonText)
        })
    })
  })
})
