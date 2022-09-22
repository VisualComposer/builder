/* global describe, it, cy */

describe('Settings Panel', function () {
  it('Opens Settings panel, checks attributes and fields', function () {
    cy.fixture('../fixtures/settingsPanel.json').then((settings) => {
      cy.createPage()
      cy.viewport(1200, 800)
      cy.addElement('Basic Button')

      cy.window().then((window) => {
        cy.intercept('POST', window.vcvAdminAjaxUrl).as('setPostPermalink')
      })

      cy.get('.vcv-ui-navbar-control[data-vcv-guide-helper="settings-control"]').click()
      cy.get('.vcv-ui-panel-heading-text').contains('Settings')

      cy.contains('.vcv-ui-form-group-heading', 'Title')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(settings.pageTitle)
        })

      cy.get('.vcv-permalink-editable')
        .then(($field) => {
          cy.wrap($field)
            .clear()
            .type(settings.pagePermalink)
        })

      cy.get('.vcv-ui-start-layout-list-item[title="Theme"]').click()

      cy.wait('@setPostPermalink')

      cy.contains('.vcv-ui-panel-navigation-container .vcv-ui-navigation-slider-button', 'Custom CSS').click()

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')
        .clear()
        .type(settings.localCSSString, {parseSpecialCharSequences: false})

      cy.get('.vcv-ui-form-button[title="Global CSS"]')
        .click()

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')
        .clear()
        .type(settings.globalCSSString, {parseSpecialCharSequences: false})

      cy.contains('.vcv-ui-panel-navigation-container .vcv-ui-navigation-slider-button', 'Custom JavaScript').click()


      cy.get('.vcv-ui-script-editor-tag')
        .contains('<footer>')
        .next('.vcv-ui-script-editor.vcv-ui-state--active')
        .find('.CodeMirror-code')
        .clear()
        .type(settings.localJavaScriptString, {parseSpecialCharSequences: false})

      cy.get('.vcv-ui-form-button[title="Global JavaScript"]')
        .click()

      cy.get('.vcv-ui-script-editor-tag')
        .contains('<footer>')
        .next('.vcv-ui-script-editor.vcv-ui-state--active')
        .find('.CodeMirror-code')
        .clear()
        .type(settings.globalJavaScriptString, {parseSpecialCharSequences: false})

      cy.savePage()
      cy.viewPage()

      cy.get('header')
      cy.get('footer')

      cy.get('.entry-title')
        .contains(settings.pageTitle)
        .should('have.css', 'color', 'rgb(255, 0, 0)')

      cy.url()
        .should('include', settings.pagePermalink)

      cy.get('.vce-button--style-basic-container')
        .should('have.class', 'vc-settings-test')

      cy.get('body')
        .should('have.css', 'background-color', 'rgb(255, 0, 0)')
        .should('have.class', 'vc-settings-test')
    })
  })
})
