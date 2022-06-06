/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Basic Button'

describe('Editor controls', function () {
  it('Checks editor navbar controls and element attributes', function () {
    cy.fixture('../fixtures/editorControls.json').then((settings) => {
      cy.createPage()
      cy.get('.blank-page-submit-button').click()

      // 1. Add element, set attributes
      cy.addElement(ELEMENT_NAME, true)
      cy.setInput('Button text', settings.buttonText)
      cy.setURL('Link selection', settings.buttonLink)
      cy.setButtonGroup('Alignment', settings.alignment)
      cy.setButtonGroup('Shape', settings.shape.name)
      cy.setButtonGroup('Size', settings.size.name)
      cy.setSwitch('Stretch')
      cy.setColor(settings.backgroundColor)
      cy.setClassAndId(settings.customId, settings.customClass)
      cy.setDO(settings.designOptions)

      // 2. Open Templates panel
      cy.get('.vcv-ui-navbar-control[data-vcv-guide-helper="plus-control"').click()
      cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
      if (Cypress.env('serverType') === 'ci') {
        cy.get('.vcv-ui-editor-no-items-content')
      }

      // 3. Check Element Search
      cy.contains('.vcv-ui-tree-view-content:not(.vcv-ui-state--hidden) .vcv-ui-navigation-slider-button', 'Elements').click()
      cy.get('#add-content-search')
        .type('YouTube Player')
      cy.get('.vcv-ui-tree-view-content.vcv-ui-tree-view-content--full-width:not(.vcv-ui-state--hidden) .vcv-ui-item-list-item')
        .its('length')
        .should('be.eq', 1)

      // 4. Open Tree View
      cy.contains('.vcv-ui-navbar-control', 'Tree View').click()
      cy.get('.vcv-ui-tree-layout .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', 1)

      // 5. Open Settings panel
      cy.get('.vcv-ui-navbar-control[data-vcv-guide-helper="settings-control"]').click()
      cy.get('.vcv-ui-panel-heading-text').contains('Options')

      cy.contains('.vcv-ui-form-group-heading', 'Title')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type('test')
        })

      cy.contains('.vcv-ui-panel-navigation-container .vcv-ui-navigation-slider-button', 'Custom CSS').click()
      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')

      cy.get('.vcv-ui-form-button[title="Global CSS"]').click()
      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')

      cy.contains('.vcv-ui-panel-navigation-container .vcv-ui-navigation-slider-button', 'Custom JavaScript').click()
      cy.get('.vcv-ui-script-editor-tag').contains('<footer>')

      cy.get('.vcv-ui-form-button[title="Global JavaScript"]').click()
      cy.get('.vcv-ui-script-editor-tag').contains('<footer>')

      cy.savePage()
      cy.viewPage()

      cy.wait(1500)

      cy.get(`.${settings.customClass}.vce-button--style-basic-container--align-${settings.alignment}`)
        .should('have.css', 'text-align', settings.alignment)

      cy.get(`#${settings.customId}`)
        .scrollIntoView()
        .contains(settings.buttonText)
        .should('have.css', 'border-radius', settings.shape.cssValue)
        .and('have.css', 'padding', settings.size.cssValue)
        .and('have.css', 'color', 'rgb(255, 255, 255)')
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

    })
  })
})
