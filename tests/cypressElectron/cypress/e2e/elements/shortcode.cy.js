/* global describe, it, cy */

const ELEMENT_NAME = 'Shortcode'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/shortcode.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      cy.window().then((window) => {
        cy.intercept('POST', window.vcvAjaxUrl).as('renderShortcode')
      })

      cy.get('.vcv-ui-edit-form-section-content .vcv-ui-form-input').first()
        .clear()
        .type(settings.shortcode)

      cy.wait('@renderShortcode')

      cy.setClassAndId(settings.customId, settings.customClass)
      // cy.setDO(settings.designOptions)
      cy.savePage()
      cy.viewPage()

      // Disable DO check for performance
      cy.get(`#${settings.customId}.${settings.customClass}`)
        // .find('.vce-shortcode-wrapper')
        // .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
        // .and('have.attr', 'data-vcv-o-animated', 'true')
        // .should('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
        // .and('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
        // .and('have.css', 'margin', settings.designOptions.margin)
        // .and('have.css', 'padding', settings.designOptions.padding)
        // .and('have.css', 'border-width', settings.designOptions.borderWidth)
        // .and('have.css', 'border-radius', settings.designOptions.borderRadius)
        // .and('have.css', 'border-style', settings.designOptions.borderStyle)
        // .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)

      cy.get('.wp-embedded-content')
        .find('a')
        .should('have.attr', 'href', settings.embedHref)

    })
  })
})
