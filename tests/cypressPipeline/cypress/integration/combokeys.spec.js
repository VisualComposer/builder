describe('Editor controls', function () {
    it('Checks different keyboard shortcuts', function () {
        cy.createPage()
       
        cy.get('#add-content-search').should('have.focus')

        // 7. Try Shift + A, S and T combinations, check if it only type capital letters and the current section is still open
        
        // Add elements search input
        cy.get('#add-content-search[placeholder="Search for content elements"]')
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.value', 'AST')
            .should('have.focus')

        // Add template search input
        cy.get('.vcv-ui-navigation-slider').find('button:contains("Templates")').click()
        cy.get('#add-content-search[placeholder="Search for templates"]')
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.value', 'AST')
            .should('have.focus')

        // Save template input
        cy.get('input[placeholder="Enter template name"')
            .focus()
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.value', 'AST')
            .should('have.focus')


        // 6. Press Shift + A, check if add tab opens
        cy.get('body').trigger('keydown', { shiftKey: true, keyCode: 65, which: 65 })

        // Text Block element
        cy.addElement('Text Block')

        //* ID
        cy.setInput('Element ID', '{shift}AST') // ?
        cy.getIframe('#vcv-editor-iframe').find('#AST')

        //* tinyMCE editor field
        cy.wait(200)
        cy.getIframe('#vcv-wpeditor-output_ifr')
            .clear()
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.text', 'AST')
            .should('have.focus')

        //* element in editor
        cy.getIframe('#vcv-editor-iframe')
            .find('.vce-text-block-wrapper.vce > .vcvhelper')
            .dblclick()
            .clear()
            .wait(100)
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.text', 'AST')
            .should('have.focus')

        cy.get('body').click(0,0)

        //* title
        cy.get('.vcv-ui-edit-form-header-title')
            .click()
            .clear()
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.text', 'AST')
            .should('have.focus')

        //* element settings -> preset name
        cy.get('.vcv-ui-edit-form-header-control[title="Element Settings"]').click()
        cy.get('.vcv-ui-form-input.vcv-ui-editor-save-preset-field')
            .focus()
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.value', 'AST')
            .should('have.focus')

        // Tree view
        // 2. Press Shift + T, check if tree view opens
        cy.get('body').trigger('keydown', { shiftKey: true, keyCode: 84, which: 84 })
        cy.get('.vcv-ui-tree-layout-container')

        cy.get('.vcv-ui-tree-layout-control-label')
            .first()
            .find('span')
            .click()
            .clear()
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.text', 'AST')
            .should('have.focus')

        // Hub
        cy.get('.vcv-ui-navbar-control[title="Visual Composer Hub"]').click()
        cy.get('#add-element-search')
            .focus()
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.value', 'AST')
            .should('have.focus')

        cy.get('body').click(0,0)

        // Settings -> Custom CSS

        // 5. Press Shift + S, check if settings tab opens
        cy.get('body').trigger('keydown', { shiftKey: true, keyCode: 83, which: 83 })
        cy.get('.vcv-ui-panel-heading').contains('Settings')

        cy.get('.vcv-ui-navigation-slider-button').contains('Custom CSS').click()
        cy.get('.CodeMirror-code')
            .first()
            .click()
            .clear()
            .type('{shift}A')
            .type('{shift}S')
            .type('{shift}T')
            .should('have.focus')

        cy.get('.CodeMirror-line').should('have.text', 'AST')

        // to be able to save, because it is not possible to save with invalid CSS
        cy.get('.CodeMirror-code')
            .first()
            .click()
            .clear()

        //esc
        cy.get('.vcv-layout-bar.vcv-ui-content-all--visible')
        cy.get('body').type('{esc}')
        cy.get('.vcv-layout-bar.vcv-ui-content--hidden')

        // 3. Press ctrl/command + Z, check if this undo last action(adding element)
        cy.get('body').trigger('keydown', { ctrlKey: true, keyCode: 90, which: 90 })
        cy.wait(200)
        cy.getIframe('#vcv-editor-iframe').find('.vcvhelper > h2').contains('AST').should('not.exist')
        //.should('have.text', 'AST')

        // 4. Press ctrl/command + shift + Z, check if this redo the last action
        cy.get('body').trigger('keydown', { ctrlKey: true, shiftKey:true, keyCode: 90, which: 90 })
        cy.wait(200)
        //cy.getIframe('#vcv-editor-iframe').find('#mce_0').contains('AST')
        cy.getIframe('#vcv-editor-iframe').find('.vcvhelper > h2').contains('AST').should('not.exist')
        //cy.getIframe('#vcv-editor-iframe').find('#mce_0').should('not.have.text', 'AST')
        cy.pause()

        // 8. Press ctrl/command + S, check if the page is saved
        cy.window().then((win) => {
            cy.route('POST', win.vcvAdminAjaxUrl).as('saveRequest')
          })
        cy.get('body').trigger('keydown', { ctrlKey: true, keyCode: 83, which: 83 })
        cy.wait('@saveRequest')
        cy.viewPage()
    })
})