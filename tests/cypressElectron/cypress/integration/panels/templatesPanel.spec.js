/* global describe, it, cy */

describe('Template Panel', function () {
  it('Adds element to the page, check Template panel functionality', function () {
    cy.fixture('../fixtures/templatesPanel.json').then((settings) => {
      cy.createPage()

      // 1. Add elements to the page
      settings.elements.forEach((element) => {
        cy.addElement(element)
      })

      // 2. Create and save two templates
      cy.get('.vcv-ui-navbar-control[title="Add Template"]').click()
      cy.window().then((window) => {
        cy.route('POST', window.vcvAdminAjaxUrl).as('saveTemplate')
      })
      cy.get('.vcv-ui-form-group-heading')
        .contains('Template Name')
        .then(($field) => {
          let form = cy.wrap($field).next()
          form.find('.vcv-ui-form-input')
              .clear()
              .type(settings.templateOneName)
              .next()
              .click()

          form = cy.wrap($field).next()
          form.find('.vcv-ui-form-input')
            .clear()
            .type(settings.templateTwoName)
            .next()
            .click()
        })
      cy.wait('@saveTemplate')

      // 3. Save a template twice to check error message
      cy.get('.vcv-ui-save-template-submit').click()
      cy.get('.vcv-ui-tree-content-error-message')
        .should('be.visible')

      // 4. Check if element thumbnail is visible in the panel
      cy.get('.vcv-ui-item-element-name')
        .find('span')
        .contains(settings.templateOneName)

      // 5. Remove all elements from the page
      cy.get('.vcv-ui-navbar-control[title="Tree View"]').click()
      cy.get('.vcv-ui-tree-layout-action[title="Remove All"]').click()

      // 6. Search for the saved template
      cy.get('.vcv-ui-navbar-control[title="Add Template"]').click()
      cy.get('#add-template-search')
        .clear()
        .type(settings.templateOneName)

      // 7. Add a template to the page
      cy.get(`.vcv-ui-item-element[title="${settings.templateOneName}"]`)
        .find('.vcv-ui-item-control[title="Add Template"]')
        .click({ force: true })

      // 8. Remove template
      cy.get(`.vcv-ui-item-element[title="${settings.templateOneName}"]`)
        .find('.vcv-ui-item-control[title="Remove Template"]')
        .click({ force: true })

      // 9. Confirm template removal
      cy.on("window:confirm", (text) => {
        expect(text).to.eq('Do you want to delete this template?')
      })
      cy.wait('@saveTemplate')

      // 10. Check template panel, template thumbnail should not exist
      cy.get('.vcv-ui-navbar-control[title="Add Template"]').click()
      cy.get('.vcv-ui-item-element-name')
        .find('span')
        .contains(settings.templateOneName)
        .should('not.exist')

      // 11. Save and view page
      cy.savePage()
      cy.viewPage()

      // 12. Check elements from the list, only one of each should exist on the page
      cy.get('.vce-button--style-basic-container')
        .its('length')
        .should('be.eq', 1)
      cy.get('.vce-single-image')
        .its('length')
        .should('be.eq', 1)
      cy.get('.vce-text-block')
        .its('length')
        .should('be.eq', 1)
    })
  })
})
