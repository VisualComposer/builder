/* global Cypress, describe, it, cy */

describe('Hub Panel', function () {
  it('Opens Hub panel, downloads element, adds element', function () {
    cy.fixture('../fixtures/hubPanel.json').then((settings) => {
      const checkItemsExistence = () => {
        cy.get('.vcv-ui-item-list')
          .first()
          .find('.vcv-ui-item-list-item')
          .its('length')
          .should('not.be.eq', 0)
      }

      cy.viewport(1100, 700)
      cy.createPage()

      // Click on Hub control, check banner exists, check items exists, close Hub panel
      cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
      cy.get('.vcv-layout-bar-content.vcv-ui-state--visible #vcv-editor-end')
      cy.get('.vcv-hub-banner-content')
        .contains('Get More Elements, Templates, and Extensions')
      cy.contains('.vcv-hub-banner-button', 'Go Premium')
        .should('have.attr', 'data-href', `${Cypress.env('baseUrl')}/wp-admin/admin.php?page=vcv-getting-started&vcv-ref=hub-banner&screen=license-options`)
      cy.contains('.vcv-ui-form-button.vcv-ui-form-button--active', 'All')
      checkItemsExistence()
      cy.get('.vcv-layout-bar-content-hide[title="Close"]').click()

      // Click on tabs, check items existence
      cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
      settings.tabs.forEach((tab) => {
        cy.contains('.vcv-ui-form-button', tab).click()
        checkItemsExistence()
      })

      // Cypress only currently supports intercepting XMLHttpRequests.
      // Requests using the Fetch API and other types of network requests like page loads and <script> tags will not be intercepted or visible in the Command Log.
      // https://github.com/cypress-io/cypress/issues/95
      // const unspalshUrl = settings.unsplashApiUrl + Cypress.env('baseUrl') + '/wp-content/plugins/builder/'
      // cy.route('GET', unspalshUrl).as('stockImagesLoad')

      // Click on Stock Images tab, click on image
      cy.contains('.vcv-ui-form-button', 'Stock Images').click()
      cy.wait(600)
      cy.contains('.vcv-stock-images-button', 'Activate Premium')
      cy.get('.vcv-stock-image-wrapper.vcv-stock-image--loaded')
        .first()
        .find('.vcv-stock-image-hover-download')
        .click()
      cy.window().then((window) => {
        cy.route('POST', window.vcvAjaxUrl).as('downloadImage')
      })
      cy.contains('.vcv-stock-image-download-button', 'Medium')
        .click({ forse: true })
      cy.wait('@downloadImage')
      cy.contains('.vcv-layout-notifications-position--bottom.vcv-layout-notifications-type--error', settings.imageDownloadError)

      // Click on Elements tab, check elements exist, check premium elements are locked
      cy.contains('.vcv-ui-form-button', 'Elements').click()
      checkItemsExistence()
      cy.contains('.vcv-ui-item-element.vcv-ui-item-element-inactive', settings.premiumElementName)
        .find('.vcv-ui-icon-lock')

      // Search for Free element, download element, add element
      cy.get('#add-element-search')
        .type(settings.freeElementName)
      cy.get('.vcv-ui-item-list')
        .first()
        .find('.vcv-ui-item-list-item')
        .its('length')
        .should('be.eq', 1)
      cy.window().then((window) => {
        cy.route('POST', window.vcvAdminAjaxUrl).as('downloadItem')
      })
      cy.contains('.vcv-ui-item-element', settings.freeElementName)
        .find('.vcv-ui-icon-download')
        .click()
      cy.get('.vcv-ui-wp-spinner-light')
      cy.wait('@downloadItem')
      cy.get('.vcv-ui-wp-spinner-light')
        .should('not.exist')
      cy.get('.vcv-ui-item-list')
        .first()
        .find('.vcv-ui-icon-add')
        .click()
      cy.get('.vcv-ui-edit-form-header-title').contains(settings.freeElementName)
      cy.setClassAndId(settings.customId, settings.customClass)

      // Click on Templates tab, check elements exist, check premium elements are locked
      cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
      cy.contains('.vcv-ui-form-button', 'Templates').click()
      checkItemsExistence()
      cy.contains('.vcv-ui-item-element.vcv-ui-item-element-inactive', settings.premiumTemplateName)
        .find('.vcv-ui-icon-lock')

      // Search for Free template, download template, add template
      cy.get('#add-element-search')
        .type(settings.freeTemplateName)
      cy.get('.vcv-ui-item-list')
        .first()
        .find('.vcv-ui-item-list-item')
        .its('length')
        .should('be.eq', 1)

      cy.contains('.vcv-ui-item-element', settings.freeTemplateName)
        .find('.vcv-ui-icon-download')
        .click()
      cy.get('.vcv-ui-wp-spinner-light')
      cy.wait('@downloadItem')
      cy.get('.vcv-ui-wp-spinner-light')
        .should('not.exist')
      cy.get('.vcv-ui-item-list')
        .first()
        .find('.vcv-ui-icon-add')
        .click()

      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.customId}`)
        .should('have.class', settings.customClass)
        .find('p')
        .contains(settings.rawHtmlText)

      cy.contains('h1 span', 'Iceland')
      cy.contains('h2 span', 'Best place of Iceland')
      cy.contains('p', 'Tourism is  financing funding Iceland hackathon accelerator long tail infographic influencer innovator travelers buzzing that land.')
      cy.contains('.vce-button--style-basic', 'Book Your Seat')
      cy.contains('.vce-button--style-basic', 'Explore Iceland')

    })
  })
})
