/* global describe, it, cy */

describe('Template Panel', function () {
  it('Adds element to the page, check Template panel functionality', function () {
    cy.fixture('../fixtures/templatesPanel.json').then((settings) => {
      cy.createPage()

      // 1. Add elements to the page
      settings.elements.forEach((element, i) => {
        const isInitial = i === 0
        cy.addElement(element, isInitial)
      })

      // 2. Create and save two templates
      cy.get('.vcv-ui-navbar-control[data-vcv-guide-helper="plus-control"').click()
      cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
      cy.window().then((window) => {
        cy.route('POST', window.vcvAdminAjaxUrl).as('saveTemplate')
      })

      cy.get('.vcv-ui-editor-save-template-field')
        .then(($field) => {
          let input = cy.wrap($field)
          input.type(settings.templateOneName)
              .next()
              .click()
          cy.wait('@saveTemplate')

          input = cy.wrap($field)
          input.type(settings.templateTwoName)
            .next()
            .click()
          cy.wait('@saveTemplate')

          input = cy.wrap($field)
          input.type(settings.templateTwoName)
        })

      // 3. Save a template twice to check error message
      cy.get('.vcv-ui-save-template-submit').click()
      cy.get('.vcv-ui-tree-content-error-message')
        .should('be.visible')

      // 4. Check if element thumbnail is visible in the panel
      cy.get('.vcv-ui-item-element-name')
        .find('span')
        .contains(settings.templateOneName)

      // 5. Remove all elements from the page
      cy.contains('.vcv-ui-navbar-control', 'Tree View').click()
      cy.get('.vcv-ui-tree-layout-action[title="Remove All"]').click()

      // 6. Search for the saved template
      cy.get('.vcv-ui-navbar-control[data-vcv-guide-helper="plus-control"').click()
      cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
      cy.get('#add-content-search[placeholder="Search for templates"]')
        .clear()
        .type(settings.templateOneName.toLowerCase())

      // 7. Add a template to the page
      cy.contains('.vcv-ui-item-element-name', settings.templateOneName)
        .closest('.vcv-ui-item-element')
        .find('.vcv-ui-item-control.vcv-ui-icon-add')
        .click({ force: true })

      // 8. Remove template
      cy.get('.vcv-ui-tree-view-content:not(.vcv-ui-state--hidden) .vcv-ui-editor-panel-settings-control').click({ force: true })
      cy.contains('.vcv-ui-item-element-name', settings.templateOneName)
        .closest('.vcv-ui-item-element')
        .find('.vcv-ui-item-control.vcv-ui-icon-close-thin')
        .click({ force: true })

      // 9. Confirm template removal
      cy.on("window:confirm", (text) => {
        expect(text).to.eq('Do you want to remove this template?')
      })
      cy.wait('@saveTemplate')

      // 10. Check template panel, template thumbnail should not exist
      cy.get('.vcv-ui-navbar-control[data-vcv-guide-helper="plus-control"').click()
      cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
      cy.get('.vcv-ui-item-element-name')
        .find('span')
        .contains(settings.templateOneName)
        .should('not.exist')

      // Prevent Saving and Viewing to save up test time
      // 11. Save and view page
      // cy.savePage()
      // cy.viewPage()

      // 12. Check elements from the list, only one of each should exist on the page
      // cy.get('.vce-button--style-basic-container')
      //   .its('length')
      //   .should('be.eq', 1)
      // cy.get('.vce-single-image')
      //   .its('length')
      //   .should('be.eq', 1)
      // cy.get('.vce-text-block')
      //   .its('length')
      //   .should('be.eq', 1)
    })
  })
})
