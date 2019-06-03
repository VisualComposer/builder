/* global describe, it, cy */

const ELEMENT_NAME = 'Single Image'
const alignment = 'right'
const animation = 'jello'
const size = {
  width: 250,
  height: 200
}
const designOptions = {
  margin: 10,
  border: 3,
  borderRadius: 5,
  borderStyle: 'dotted',
  padding: 30,
  bgColor: {
    hex: 'BF5C5C',
    rgb: 'rgb(191, 92, 92)'
  },
  borderColor: {
    hex: 'FFC000',
    rgb: 'rgb(255, 192, 0)'
  }
}
const customId = 'single-image-id'
const customClass = 'single-image-class'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.createPage()
    cy.addElement(ELEMENT_NAME)

    cy.get('.vcv-ui-form-group-heading')
      .contains('OnClick action')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .select('lightbox')
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
          .next()
          .clear()
          .type(`${size.width}x${size.height}`)
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Alignment')
      .then(($field) => {
        cy.wrap($field)
          .next('.vcv-ui-form-buttons-group')
          .find(`.vcv-ui-form-button[data-value="${alignment}"]`)
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

    cy.get('.vcv-ui-form-switch-trigger-label')
      .contains('Simple controls')
      .click()

    cy.get('.vcv-ui-form-input[name="margin"]')
      .type(`${designOptions.margin}px`)
    cy.get('.vcv-ui-form-input[name="borderWidth"]')
      .type(`${designOptions.border}px`)
    cy.get('.vcv-ui-form-input[name="padding"]')
      .type(`${designOptions.padding}px`)
    cy.get('.vcv-ui-form-input[name="borderRadius"]')
      .type(`${designOptions.borderRadius}px`)

    cy.get('.vcv-ui-form-group-heading')
      .contains('Background color')
      .then(($field) => {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="000000"]')
          .clear()
          .type(designOptions.bgColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Border style')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .select(designOptions.borderStyle)
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Border color')
      .then(($field) => {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="000000"]')
          .clear()
          .type(designOptions.borderColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      })

    cy.get('.vcv-ui-form-group-heading')
      .contains('Animate')
      .then(($field) => {
        cy.wrap($field)
          .next()
          .select(animation)
      })

    cy.savePage()
    cy.viewPage()

    cy.get(`#${customId}`)
      .should('have.class', customClass)
      .should('have.css', 'text-align', alignment)

    cy.get('.vce-single-image-wrapper')
      .should('have.attr', 'data-vce-animate', `vce-o-animate--${animation}`)
      .and('have.attr', 'data-vcv-o-animated', 'true')
      .should('have.css', 'animation-name', `vce-o-animate--${animation}`)
      .and('have.css', 'background-color', designOptions.bgColor.rgb)
      .and('have.css', 'margin', `${designOptions.margin}px`)
      .and('have.css', 'padding', `${designOptions.padding}px`)
      .and('have.css', 'border-width', `${designOptions.border}px`)
      .and('have.css', 'border-radius', `${designOptions.borderRadius}px`)
      .and('have.css', 'border-style', designOptions.borderStyle)
      .and('have.css', 'border-color', designOptions.borderColor.rgb)

    cy.get('.vce-single-image')
  //    .should('have.css', 'width')
      .and('have.css', 'height')

    cy.get('.vce-single-image-inner').eq(0)
      .should('have.class', 'vce-single-image--border-rounded')
      .should('have.css', 'border-radius', '5px')
      .click()

    cy.get('.vce-lightbox')
      .should('have.css', 'display', 'block')
  })
})
