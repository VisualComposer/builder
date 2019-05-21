/* global describe, it, cy */

const ELEMENT_NAME = 'Basic Button'
const buttonText = 'Hello World'
const buttonLink = 'visualcomposer.com'
const customId = 'basic-button-id'
const customClass = 'basic-button-class'
const titleColor = {
  hex: 'FFC000',
  rgb: 'rgb(255, 192, 0)'
}
const backgroundColor = {
  hex: '9461D3',
  rgb: 'rgb(148, 97, 211)'
}
const alignment = 'center'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vcv-ui-form-group-heading')
      .contains('Button text')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .clear()
          .type(buttonText)
      })

    cy.get('.vcv-ui-form-link-button').click()
    cy.get('.vcv-ui-modal .vcv-ui-form-group-heading')
      .contains('URL')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-editor-dropdown-input-container')
          .find('input')
          .type(buttonLink)
      })
    cy.get('.vcv-ui-modal label[for="targetBlank-0-1"]').click()
    cy.get('.vcv-ui-modal .vcv-ui-modal-action').click()
    cy.get('.vcv-ui-form-group-heading')
      .contains('Alignment')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-form-buttons-group')
          .find(`.vcv-ui-form-button[data-value="${alignment}"]`)
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Shape')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-form-buttons-group')
          .find('.vcv-ui-form-button[data-value="rounded"]')
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Size')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-form-buttons-group')
          .find('.vcv-ui-form-button[data-value="small"]')
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Stretch button')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-form-switch-container')
          .find('.vcv-ui-form-switch')
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Title color')
      .then(($field) => {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="FFFFFF"]')
          .clear()
          .type(titleColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Background color')
      .then(($field) => {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="557CBF"]')
          .clear()
          .type(backgroundColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Element ID')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .type(customId)
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Extra class name')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .type(customClass)
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Animate')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .select('bounce')
      })

    cy.savePage()
    cy.viewPage()

    cy.get('.vce-button--style-basic-container')
      .should('have.class', customClass)
      .should('have.css', 'text-align', alignment)

    cy.get('.vce-button--style-basic-wrapper--stretched')
      .should('have.css', 'width')

    cy.get(`#${customId}`)
      .contains(buttonText)
      .should('have.css', 'border-radius', '5px')
      .and('have.css', 'padding', '10px 30px')
      .and('have.css', 'color', titleColor.rgb)
      .and('have.css', 'background-color', backgroundColor.rgb)
      .and('have.css', 'animation-name', 'vce-o-animate--bounce')
      .should('have.attr', 'data-vce-animate', 'vce-o-animate--bounce')
      .and('have.attr', 'data-vcv-o-animated', 'true')
      .and('have.attr', 'href', `http://${buttonLink}`)
      .and('have.attr', 'target', '_blank')
  })
})
