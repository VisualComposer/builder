/* global describe, it, cy */

describe('Settings Panel', function () {
  it('Opens Settings panel, checks attributes and fields', function () {
    cy.fixture('../fixtures/settingsPanel.json').then((settings) => {
      cy.createPage()
      cy.addElement('Basic Button')

      cy.get('.vcv-ui-navbar-control[title="Settings"]').click()
      cy.get('.vcv-ui-edit-form-header-title').contains('Settings')

      cy.get('.vcv-ui-form-group-heading')
        .contains('Title')
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

      cy.get('.vcv-ui-start-layout-list-item[title="Theme default"]').click()

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')
        .clear()
        .type(settings.localCSSString, {parseSpecialCharSequences: false})

      cy.get('.vcv-ui-form-button[title="Global CSS"]')
        .click()

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')
        .clear()
        .type(settings.globalCSSString, {parseSpecialCharSequences: false})

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

      cy.get('#vcv-page-element-preview-disable')
        .click({force: true})

      cy.get('.vcv-ui-navbar-control[title="Add Element"]').click()
      cy.get('.vcv-ui-item-element[title="Row"]').trigger('mouseover')
      cy.get('.vcv-ui-item-preview-container.vcv-ui-state--visible').should('not.exist')

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
