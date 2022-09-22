/* global describe, it, cy */

describe('Global CSS', function () {
  it('Add text block, save global css, create new page, delete global css', function () {
    cy.fixture('../fixtures/globalCss.json').then((settings) => {
      cy.createPage()
      cy.viewport(1200, 800)
      cy.addElement('Text Block')

      cy.get('[data-vcv-guide-helper="settings-control"]').click()

      cy.get('.vcv-ui-navigation-slider-button')
        .contains('Custom CSS')
        .click()

      cy.get('.vcv-ui-form-button[title="Global CSS"]')
        .click()

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-wrap').then(($cm) => {
        const cm = $cm.get(0).CodeMirror
        cm.setValue('')
        cm.clearHistory()
      })

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')
        .type(settings.globalCSSString, {parseSpecialCharSequences: false})

      cy.get('.vcv-ui-form-button[title="Local CSS"]')
        .click()

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-code')
        .type(settings.localCSSString, {parseSpecialCharSequences: false})

      cy.savePage()
      cy.viewPage()

      cy.get('.vce-text-block-wrapper p')
        .should('have.css', 'color', settings.localColor)

      // Check local and global css order
      cy.createPage()
      cy.addElement('Text Block')
      cy.window().then((win) => {
        cy.intercept('POST', win.vcvAdminAjaxUrl).as('secondPagePermalink')
      })
      cy.contains('[data-vcv-guide-helper="save-control"] .vcv-ui-navbar-dropdown-content .vcv-ui-navbar-control-content', 'Publish')
        .parent()
        .click({ force: true })
      cy.wait('@secondPagePermalink')
      cy.viewPage()

      cy.get('.vce-text-block-wrapper p')
        .should('have.css', 'color', settings.color)

      // Check deleting global css
      cy.createPage()

      cy.addElement('Text Block')

      cy.get('[data-vcv-guide-helper="settings-control"]').click()

      cy.get('.vcv-ui-navigation-slider-button')
        .contains('Custom CSS')
        .click()

      cy.get('.vcv-ui-form-button[title="Global CSS"]')
        .click()

      cy.get('.vcv-ui-style-editor.vcv-ui-state--active .CodeMirror-wrap').then(($cm) => {
        const cm = $cm.get(0).CodeMirror
        cm.setValue('')
        cm.clearHistory()
      })

      cy.savePage()
      cy.viewPage()

      cy.get('@secondPagePermalink').should((response) => {
        cy.visit(response.response.body.postData.permalink)
      })

      cy.get('.vce-text-block-wrapper p')
        .should('not.have.css', 'color', settings.color)
    })
  })
})
