/* global describe, it, cy */

const ELEMENT_NAME = 'Row'
const rowId = 'row-with-options'
const backgroundColor = {
  hex: '811E6C',
  rgb: 'rgb(129, 30, 108)'
}
const columnGap = 20

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vcv-ui-form-button[data-value="stretchedRowAndColumn"]').click()
    cy.get('.vcv-ui-form-group-heading')
      .contains('Column gap')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .clear()
          .type(columnGap)
      })
    cy.get('.vcv-ui-form-group-heading')
      .contains('Full height')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-form-switch-container')
          .find('.vcv-ui-form-switch')
          .click()
      })
    cy.get('.vcv-ui-form-button[data-value="stretch"]').click()
    cy.get('.vcv-ui-form-group-heading')
      .contains('Content position')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-form-buttons-group')
          .find('.vcv-ui-form-button[data-value="middle"]')
          .click()
      })
    cy.get('.vcv-ui-form-group-heading')
      .contains('Element ID')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .type(rowId)
      })
    cy.get('.vcv-ui-form-layout-layouts-col[data-index="2"]').click()
    cy.get('.vcv-ui-color-picker-dropdown').click()
    cy.get('.vcv-ui-color-picker-custom-color input[value="000000"]')
      .clear()
      .type(backgroundColor.hex)
    cy.get('.vcv-ui-color-picker-dropdown').click()

    cy.savePage()
    cy.viewPage()

    cy.get(`#${rowId}`)
    cy.get('.vce-row')
      .should('have.class', `vce-row--col-gap-${columnGap}`)
      .and('have.class', 'vce-row-full-height')
      .and('have.class', 'vce-row-columns--stretch')
      .and('have.class', 'vce-row-content--middle')
      .should('have.attr', 'data-vce-full-width', 'true')
      .and('have.attr', 'data-vce-stretch-content', 'true')

      .should('have.css', 'background-color', backgroundColor.rgb)
    cy.window()
      .then((win) => {
        cy.get('.vce-row')
          .should('have.css', 'width')
          .and('have.css', 'height')
      })
    cy.get('.vce-row-content')
      .children()
      .should('have.length', 3)
    cy.get('.vce-row-content')
      .should('have.css', 'display', 'flex')
    cy.get('.vce-col')
      .should('have.css', 'display', 'flex')
      .and('have.css', 'flex', '1 1 0px')
  })
})
