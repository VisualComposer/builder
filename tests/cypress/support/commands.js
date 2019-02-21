// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/* global Cypress, cy */

// Login to WordPress dashboard
Cypress.Commands.add('login', () => {
  cy.server()
  cy.visit('/wp-login.php')
  cy.wait(100)
  cy.get('#user_login').type(Cypress.env('wpUserName'))
  cy.get('#user_pass').type(`${Cypress.env('wpPassword')}{enter}`)
  // // Plugin activation
  if (Cypress.env('serverType') !== 'local') {
    cy.visit('/wp-admin/plugins.php')
    cy.get(`[data-plugin="${Cypress.env('dataPlugin')}"]`).then(($block) => {
      if (!$block.hasClass('active')) {
        // cy.get(`[data-slug="${Cypress.env('slug')}"] .deactivate a`).click()
        // cy.get(`#vcv-visual-composer-website-builder a.vcv-deactivation-submit-button`).click()
        cy.get(`[data-plugin="${Cypress.env('dataPlugin')}"] .activate a`).click()
      }
    })
  }
})

// Create a new page with Visual Composer
Cypress.Commands.add('createPage', () => {
  cy.visit(Cypress.env('newPage'))
  cy.window().then((win) => {
    cy.route('POST', win.vcvAdminAjaxUrl).as('loadContentRequest')
  })
  cy.wait('@loadContentRequest')
})

// In the Blank Page:
// 1. Add element
// 2. Save page
// 3. View page
Cypress.Commands.add('addElement', (elementName) => {
  cy.get('.vcv-ui-navbar-control[title="Add Element"]').click()
  cy.get(`.vcv-ui-item-element[title="${elementName}"]`).click()
  cy.get('.vcv-ui-edit-form-header-title').contains(elementName)
  cy.window().then((win) => {
    cy.route('POST', win.vcvAdminAjaxUrl).as('saveRequest')
  })
  cy.get('.vcv-ui-navbar-control[title="Publish"]').click()
  cy.wait('@saveRequest')

  cy.get('.vcv-ui-navbar-control[title="View Page"]')
    .should('have.attr', 'data-href')
    .then((href) => {
      cy.visit(href)
    })
})
