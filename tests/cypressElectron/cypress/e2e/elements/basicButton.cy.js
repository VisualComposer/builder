/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Basic Button'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/basicButton.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      cy.setInput('Button text', settings.buttonText)
      cy.setURL('Link selection', settings.buttonLink)
      cy.setButtonGroup('Alignment', settings.alignment)
      cy.setButtonGroup('Shape', settings.shape.name)
      cy.setButtonGroup('Size', settings.size.name)
      cy.setSwitch('Stretch')
      cy.setColor(settings.titleColor)
      cy.setColor(settings.backgroundColor)
      cy.setClassAndId(settings.customId, settings.customClass)
      cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.wait(1000)
      cy.get(`.${settings.customClass}.vce-button--style-basic-container--align-${settings.alignment}`)
        .should('have.css', 'text-align', settings.alignment)

      cy.get(`#${settings.customId}`)
        .contains(settings.buttonText)
        .should('have.css', 'border-radius', settings.shape.cssValue)
        .and('have.css', 'padding', settings.size.cssValue)
        .and('have.css', 'color', settings.titleColor.valueRgb)
        .and('have.css', 'background-color', settings.backgroundColor.valueRgb)
        .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
        .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
        .and('have.attr', 'data-vcv-o-animated', 'true')
        .and('have.attr', 'href', `http://${settings.buttonLink.url}`)
        .and('have.attr', 'target', '_blank')

      cy.get('.vce-button--style-basic-wrapper--stretched')
        .then((element) => {
          let contentContainerWidth
          cy.window().then((window) => {
            const contentContainer = window.document.querySelector( '.vce-row')
            contentContainerWidth = window.getComputedStyle(contentContainer).width
            cy.wrap(element)
              .should('have.css', 'width', contentContainerWidth)
          })
        })

      if (Cypress.env('checkSnapshots')) {
        cy.wait(2000)
        cy.get(`#${settings.customId}`).matchImageSnapshot({ blur: 2 })
      }
    })
  })
})
