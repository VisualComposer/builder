/* global describe, it, cy */

const ELEMENT_NAME = 'Outline Button'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/outlineButton.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      cy.setInput('Button text', settings.buttonText)
      cy.setButtonGroup('Alignment', settings.alignment)
      cy.setClassAndId(settings.customId, settings.customClass)
      cy.get('.vcv-ui-edit-form-header-control[title="Substitute Element"]').click()

      cy.get('.vcv-ui-replace-element-list .vcv-ui-item-element[title="Basic Button"]').click({ force: true })
      cy.wait(500)
      cy.get('.vcv-ui-replace-element-list .vcv-ui-item-element[title="Basic Button"] .vcv-ui-item-element-content.vcv-ui-item-list-item-content--active')
      cy.get('.vcv-ui-edit-form-header-title').contains('Basic Button')

      cy.savePage()
      cy.viewPage()

      cy.get(`.${settings.customClass}.vce-button--style-basic-container--align-${settings.alignment}`)
        .should('have.css', 'text-align', settings.alignment)

      cy.get(`#${settings.customId}`)
        .contains(settings.buttonText)
    })
  })
})
