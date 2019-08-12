/* global describe, it, cy */

const ELEMENT_NAME = 'Single Image'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/singleImage.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.get('.vcv-ui-form-group-heading')
        .contains('OnClick action')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .select(settings.onClickAction)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Shape')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-buttons-group')
            .find(`.vcv-ui-form-button[data-value="${settings.shape}"]`)
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Size')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .clear()
            .type(`${settings.size.width}x${settings.size.height}`)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Alignment')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-buttons-group')
            .find(`.vcv-ui-form-button[data-value="${settings.alignment}"]`)
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Element ID')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .type(settings.customId)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Extra class name')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .type(settings.customClass)
        })

      cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.customId}`)
        .should('have.class', settings.customClass)
        .should('have.css', 'text-align', settings.alignment)

      cy.get('.vce-single-image-wrapper')
        .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
        .and('have.attr', 'data-vcv-o-animated', 'true')
        .should('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
        .and('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
        .and('have.css', 'margin', settings.designOptions.margin)
        .and('have.css', 'padding', settings.designOptions.padding)
        .and('have.css', 'border-width', settings.designOptions.borderWidth)
        .and('have.css', 'border-radius', settings.designOptions.borderRadius)
        .and('have.css', 'border-style', settings.designOptions.borderStyle)
        .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)

      cy.get('.vce-single-image')
        .should('have.attr', 'data-width', settings.size.width)
        .and('have.attr', 'data-height', settings.size.height)

      cy.get('.vce-single-image-inner').eq(0)
        .should('have.class', 'vce-single-image--border-rounded')
        .should('have.css', 'border-radius', '5px')
        .click()

      cy.get('.vce-lightbox')
        .should('have.css', 'display', 'block')
    })
  })
})
