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
      cy.get('@firstPageEdit').should((response) => {
        cy.visit(response.response.body.postData.backendEditorUrl)
      })

      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'fe')

      // Enable gutenberg editor
      cy.visit('/wp-admin/admin.php?page=vcv-settings')
      cy.get('input[name="vcv-settings-gutenberg-editor-enabled"]').check({force: true})
      cy.get('#submit_btn')
        .click()

      // Set editor type as gutenberg
      cy.get('@firstPageEdit').should((response) => {
        cy.visit(response.response.body.postData.backendEditorUrl + '&vcv-set-editor=gutenberg')
      })

      // Check gutenberg editor
      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'gutenberg')

      cy.get('#post-title-0')
        .type('Test', {force: true})

      cy.get('.editor-post-publish-button')
        .click()

      cy.get('@firstPageEdit').should((response) => {
        cy.visit(response.response.body.postData.backendEditorUrl)
      })

      cy.reload()
      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'gutenberg')

      // Disable Gutenberg Editor
      cy.visit('/wp-admin/admin.php?page=vcv-settings')
      cy.get('input[name="vcv-settings-gutenberg-editor-enabled"]').uncheck({force: true})
      cy.get('#submit_btn')
        .click()

      // Check classic editor
      cy.get('@firstPageEdit').should((response) => {
        cy.visit(response.response.body.postData.backendEditorUrl + '&classic-editor')
      })

      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'classic')

      cy.get('#publish')
        .click()

      cy.get('@firstPageEdit').should((response) => {
        cy.visit(response.response.body.postData.backendEditorUrl)
      })

      cy.get('input[name="vcv-be-editor"]')
        .should('have.value', 'classic')
    })
  })
})
