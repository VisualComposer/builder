/* global describe, it, cy */

const ELEMENT_NAME = 'Single Image'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/singleImage.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      cy.setSelect('OnClick action', settings.onClickAction)
      cy.get('.vcv-ui-form-link-button').click()
      cy.get('.vcv-ui-modal .vcv-ui-form-group-heading')
        .contains('URL')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-editor-dropdown-input-container')
            .find('input')
            .type(settings.imageLink.url)
        })

      cy.get('.vcv-ui-modal label[for="targetBlank-0-1"]').click()
      cy.get('.vcv-ui-modal .vcv-ui-modal-action').click()

      cy.contains('.vcv-ui-form-switch-trigger-label', 'Enable Instagram-like filters')
        .click()
      cy.setButtonGroup('Shape', settings.shape.name)

      cy.get('.vcv-ui-form-attach-image-filter-list-item')
        .find('.vcv-ui-form-attach-image-filter-name')
        .contains(settings.instagramFilter.name)
        .click()

      cy.setInput('Size', `${settings.size.width}x${settings.size.height}`)
      cy.setButtonGroup('Alignment', settings.alignment)
      cy.setClassAndId(settings.customId, settings.customClass)
      // cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.customId}.${settings.customClass}`)
        .should('have.css', 'text-align', settings.alignment)

      // Disable DO check for performance
      // cy.get('.vce-single-image-wrapper')
      //   .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
      //   .and('have.attr', 'data-vcv-o-animated', 'true')
      //   .should('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
      //   .and('have.css', 'background-color', settings.designOptions.backgroundColor.rgb)
      //   .and('have.css', 'margin', settings.designOptions.margin)
      //   .and('have.css', 'padding', settings.designOptions.padding)
      //   .and('have.css', 'border-width', settings.designOptions.borderWidth)
      //   .and('have.css', 'border-radius', settings.designOptions.borderRadius)
      //   .and('have.css', 'border-style', settings.designOptions.borderStyle)
      //   .and('have.css', 'border-color', settings.designOptions.borderColor.rgb)

      cy.get('.vce-single-image')
        .should('have.css', 'width', `${settings.size.width}px`)
        .and('have.css', 'height', `${settings.size.height}px`)

      cy.get('.vce-single-image-inner').eq(0)
        .should('have.class', `vce-single-image--border-${settings.shape.name}`)
        .and('have.class', `vce-image-filter--${settings.instagramFilter.name}`)
        .should('have.css', 'border-radius', settings.shape.cssValue)
        .and('have.css', 'filter', settings.instagramFilter.cssValue)
        .should('have.attr', 'href', `http://${settings.imageLink.url}`)
        .and('have.attr', 'target', '_blank')
    })
  })
})
