/* global describe, it, cy */

const capitalA = '{shift}A'
const capitalS = '{shift}S'
const capitalT = '{shift}T'

describe('Keyboard shortcuts', function () {
    it('Checks different keyboard shortcuts', function () {
        cy.createPage()
        cy.get('#add-content-search').should('have.focus')

        // Try Shift + A, S and T combinations, check if it only type capital letters and the current section is still open

        // Add elements search input
        cy.get('#add-content-search[placeholder="Search for content elements"]')
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.value', 'AST')
            .should('have.focus')

        // Add template search input
        cy.get('.vcv-ui-navigation-slider').find('button:contains("Templates")').click()
        cy.get('#add-content-search[placeholder="Search for templates"]')
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.value', 'AST')
            .should('have.focus')

        // Save template input
        cy.get('input[placeholder="Enter template name"')
            .focus()
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.value', 'AST')
            .should('have.focus')


        // Press Shift + A, check if add tab opens
        cy.get('body').trigger('keydown', { shiftKey: true, keyCode: 65, which: 65 })

        // Add Text Block element
        cy.addElement('Text Block')

        // Try Shift + A, S and T combinations, check if it only type capital letters and the current section is still open

        //* ID
        cy.contains('.vcv-ui-navigation-slider-button', 'Advanced').click()
        cy.setInput('Element ID', '{shift}AST')
        cy.getIframe('#vcv-editor-iframe').find('#AST')

        cy.wait(500)
        //* tinyMCE editor field
        cy.getIframe('#vcv-wpeditor-output_ifr')
            .clear()
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.text', 'AST')
            .should('have.focus')

        //* title
        cy.get('.vcv-ui-edit-form-header-title')
            .click()
            .clear()
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.text', 'AST')
            .should('have.focus')

        //* element settings -> preset name

        //it requires premium, so we can't test it now

        // cy.get('.vcv-ui-edit-form-header-control[title="Element Settings"]').click()
        // cy.get('.vcv-ui-form-input.vcv-ui-editor-save-preset-field')
        //     .focus()
        //     .type(capitalA)
        //     .type(capitalS)
        //     .type(capitalT)
        //     .should('have.value', 'AST')
        //     .should('have.focus')


        // Tree view
        // Press Shift + T, check if tree view opens
        cy.get('body').trigger('keydown', { shiftKey: true, keyCode: 84, which: 84 })
        cy.get('.vcv-ui-tree-layout-container')


        // Try Shift + A, S and T combinations, check if it only type capital letters and the current section is still open

        cy.get('.vcv-ui-tree-layout-control-label')
            .first()
            .find('span')
            .click()
            .clear()
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.text', 'AST')
            .should('have.focus')

        // Hub
        cy.get('.vcv-ui-navbar-control[title="Visual Composer Hub"]').click()
        cy.get('#add-element-search')
            .focus()
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.value', 'AST')
            .should('have.focus')

        cy.get('body').click(0,0)

        // Press Shift + S, check if settings tab opens
        cy.get('body').trigger('keydown', { shiftKey: true, keyCode: 83, which: 83 })
        cy.get('.vcv-ui-panel-heading').contains('Options')

        // Try Shift + A, S and T combinations, check if it only type capital letters and the current section is still open
        // Settings -> Custom CSS

        cy.get('.vcv-ui-navigation-slider-button').contains('Custom CSS').click()
        cy.get('.CodeMirror-code')
            .first()
            .click()
            .clear()
            .type(capitalA)
            .type(capitalS)
            .type(capitalT)
            .should('have.focus')

        cy.get('.CodeMirror-line').should('have.text', 'AST')

        // to be able to save, because it is not possible to save with invalid CSS
        cy.get('.CodeMirror-code')
            .first()
            .click()
            .clear()
            .blur()

        // Press Esc, check if the sidebar closes
        cy.get('.vcv-layout-bar.vcv-ui-content-all--visible')
        cy.get('body').type('{esc}')
        cy.get('.vcv-layout-bar.vcv-ui-content--hidden')

        // Press ctrl/command + Z, check if this undo last action(editing text field text)
        cy.get('body').trigger('keydown', { ctrlKey: true, keyCode: 90, which: 90 })
        cy.wait(600)
        cy.getIframe('#vcv-editor-iframe').find('.vce-text-block h2').contains('Typography is the art and technique').should('exist')

        // Press ctrl/command + shift + Z, check if this redo the last action
        cy.get('body').focus().trigger('keydown', { ctrlKey: true, shiftKey:true, keyCode: 90, which: 90 })
        cy.wait(600)
        cy.getIframe('#vcv-editor-iframe').find('.vce-text-block h2').contains('Typography is the art and technique').should('not.exist')

        // Press ctrl/command + S, check if the page is saved
        cy.window().then((win) => {
            cy.intercept('POST', win.vcvAdminAjaxUrl).as('saveRequest')
          })
        cy.get('body').trigger('keydown', { ctrlKey: true, keyCode: 83, which: 83 })
        cy.wait('@saveRequest')
        cy.viewPage()

        cy.get('.vce-text-block')
            .should('have.attr', 'id', 'AST')
            .contains('AST')

    })
})
