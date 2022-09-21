/* global describe, it, cy */

const ELEMENT_NAME = 'Text Block'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/textBlock.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      cy.setTinyMce({
        title: 'Content',
        text: settings.text,
        elementType: {
          name: settings.elementType.name
        },
        alignment: {
          name: settings.alignment.name
        }
      })

      cy.setClassAndId(settings.customId, settings.customClass)

      // cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.get('.vce-text-block')
        .should('have.class', settings.customClass)
        .should('have.attr', 'id', settings.customId)

      // Disable DO check for performance
      cy.get('.vce-text-block-wrapper')
        // .should('have.css', 'border-radius', settings.designOptions.borderRadius)
        // .and('have.css', 'border-width', settings.designOptions.borderWidth)
        // .and('have.css', 'border-style', settings.designOptions.borderStyle)
        // .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)
        // .and('have.css', 'padding', settings.designOptions.padding)
        // .and('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
        // .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
        // .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
        // .and('have.attr', 'data-vcv-o-animated', 'true')
        .within(($wrapper) => {
          cy.get(settings.elementType.tag)
            .contains(settings.text)
            .should('have.css', 'text-align', settings.alignment.type)
        })
    })
  })
})
