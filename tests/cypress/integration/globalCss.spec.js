/* global describe, it, cy */

describe('Global CSS', function () {
  it('Add text block, save global css, create new page, delete global css', function () {
    cy.fixture('../fixtures/globalCss.json').then((settings) => {
      cy.createPage()
      cy.addElement('Text Block')

      cy.get('.vcv-ui-navbar-control[title="Settings"]').click()

      cy.get('.vcv-ui-form-button')
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

      cy.window().then((win) => {
        cy.route('POST', win.vcvAdminAjaxUrl).as('firstPagePermalink')
      })
      cy.get('.vcv-ui-navbar-control[title="Publish"]').click()
      cy.wait('@firstPagePermalink')

      cy.viewPage()

      cy.get('.vce-text-block-wrapper p')
        .should('have.css', 'color', settings.color)

      cy.createPage()

      cy.addElement('Text Block')

      cy.get('.vcv-ui-navbar-control[title="Settings"]').click()

      cy.get('.vcv-ui-form-button')
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

      cy.get('@firstPagePermalink').should((response) => {
        cy.visit(response.response.body.postData.permalink)
      })

      cy.get('.vce-text-block-wrapper p')
        .should('not.have.css', 'color', settings.color)
    })
  })
})
