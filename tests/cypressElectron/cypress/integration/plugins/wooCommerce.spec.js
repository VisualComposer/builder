/* global describe, it, cy, Cypress */

describe('WooCommerce plugin', function () {
  it('Enables Product post type, creates a Product page, adds content, check WP product page for WooCommerce plugin compliance.', function () {
    cy.viewport(1200, 800)
    cy.visit('/wp-admin/admin.php?page=wc-status')

    cy.contains('.updated.woocommerce-message .skip', 'Skip setup')
      .click()

    cy.visit(`${Cypress.env('baseUrl')}wp-admin/post-new.php?post_type=product&vcv-action=frontend`)

    cy.get('.vcv-start-blank-title-input')
      .clear()
      .type('VC Test Product')

    cy.addElement('Single Image')
    cy.addElement('Text Block')
    cy.addElement('Basic Button')

    cy.savePage()

    cy.visit(`${Cypress.env('baseUrl')}shop`)

    cy.contains('.woocommerce-loop-product__title', 'VC Test Product')
      .click()

    cy.get('.vce-text-block')
    cy.get('.vce-single-image')
    cy.get('.vce-button--style-basic')
  })
})
