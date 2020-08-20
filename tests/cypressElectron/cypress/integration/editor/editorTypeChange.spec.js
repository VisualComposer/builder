/* global describe, it, cy */

describe('Editor Type Change', function () {
  it('Create a page and try to change editor type as vc editor, gutenberg, classic editor', function () {
    cy.fixture('../fixtures/editorTypeChange.json').then((settings) => {
      cy.createPage()
      cy.addElement('Text Block')

      cy.window().then((win) => {
        cy.route('POST', win.vcvAdminAjaxUrl).as('firstPageEdit')
      })
      cy.get('.vcv-ui-navbar-control[title="Publish"]').click()
      cy.wait('@firstPageEdit')

      // Check visual composer editor
      let backendEditorUrlLink = '';
      cy.get('@firstPageEdit').should((response) => {
        backendEditorUrlLink = response.response.body.postData.backendEditorUrl
        cy.visit(backendEditorUrlLink)
      })

      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'fe')

      // Enable gutenberg editor
      cy.visit('/wp-admin/admin.php?page=vcv-settings')
      cy.window().then((win) => {
        let actionURL = win.document.querySelector('.vcv-dashboards-section-content--active form').getAttribute('action')
        actionURL = win.decodeURIComponent(actionURL);
        cy.route('POST', actionURL).as('settingSaving')
      })
      cy.get('input[name="vcv-settings-gutenberg-editor-enabled"]').check({force: true})
      cy.get('.vcv-dashboards-section-content--active #submit_btn').click()
      cy.wait('@settingSaving')

      cy.get('@firstPageEdit').should(() => {
        cy.visit(backendEditorUrlLink + '&vcv-set-editor=gutenberg')
      })

      // Check gutenberg editor
      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'gutenberg')

      cy.get('#post-title-1')
        .type('Test', {force: true})

      cy.get('.editor-post-publish-button')
        .click()

      cy.get('@firstPageEdit').should((response) => {
        cy.visit(backendEditorUrlLink)
      })

      cy.reload()
      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'gutenberg')

      // Disable Gutenberg Editor
      cy.visit('/wp-admin/admin.php?page=vcv-settings')
      cy.get('input[name="vcv-settings-gutenberg-editor-enabled"]').uncheck({force: true})
      cy.get('.vcv-dashboards-section-content--active #submit_btn').click()
      cy.wait('@settingSaving')

      // Check classic editor
      cy.get('@firstPageEdit').should(() => {
        cy.visit(backendEditorUrlLink + '&classic-editor')
      })

      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'classic')

      cy.get('#publish')
        .click()

      cy.get('@firstPageEdit').should(() => {
        cy.visit(backendEditorUrlLink)
      })

      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'classic')
    })
  })
})
