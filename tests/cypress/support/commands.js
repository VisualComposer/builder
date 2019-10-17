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
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

addMatchImageSnapshotCommand()

// Login to WordPress dashboard
Cypress.Commands.add('login', () => {
  cy.server()
  if (Cypress.env('serverType') !== 'ci') {
    cy.visit('/wp-login.php')
    cy.wait(200)
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
  }

  if (Cypress.env('checkSnapshots')) {
    cy.visit('/wp-admin/themes.php')
    cy.get('[data-slug="twentynineteen"]').then(($block) => {
      if (!$block.hasClass('active')) {
        cy.get('[data-slug="twentynineteen"] a.activate').click()
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

// Add element
Cypress.Commands.add('addElement', (elementName) => {
  cy.get('.vcv-ui-navbar-control[title="Add Element"]').click()
  cy.get(`.vcv-ui-item-element[title="${elementName}"]`).click()
  cy.get('.vcv-ui-edit-form-header-title').contains(elementName)
})

// Save page
Cypress.Commands.add('savePage', () => {
  cy.window().then((win) => {
    cy.route('POST', win.vcvAdminAjaxUrl).as('saveRequest')
  })
  cy.get('.vcv-ui-navbar-control[title="Publish"]').click()
  cy.wait('@saveRequest')
})

// View page
Cypress.Commands.add('viewPage', () => {
  cy.window().then((win) => {
    cy.visit(win.vcvPostData.permalink)
  })
})

// Set Design Options
Cypress.Commands.add('setDO', (settings) => {
  cy.get('.advanced-design-options .vcv-ui-form-switch-trigger-label')
    .contains('Simple controls')
    .then(($field) => {
      cy.wrap($field)
        .click()
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Padding')
    .then(($field) => {
      if (settings.padding) {
        cy.wrap($field)
          .next()
          .type(settings.padding)
      }
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Border')
    .then(($field) => {
      if (settings.borderWidth) {
        cy.wrap($field)
          .next()
          .type(settings.borderWidth)
      }
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Radius')
    .then(($field) => {
      if (settings.borderRadius) {
        cy.wrap($field)
          .next()
          .type(settings.borderRadius)
      }
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Margin')
    .then(($field) => {
      if (settings.margin) {
        cy.wrap($field)
          .next()
          .type(settings.margin)
      }
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Background color')
    .then(($field) => {
      if (settings.backgroundColor && settings.backgroundColor.hex) {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="000000"]')
          .clear()
          .type(settings.backgroundColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      }
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Border style')
    .then(($field) => {
      if (settings.borderStyle) {
        cy.wrap($field)
          .next()
          .select(settings.borderStyle)
      }
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Border color')
    .then(($field) => {
      if (settings.borderColor && settings.borderColor.hex) {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="000000"]')
          .clear()
          .type(settings.borderColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      }
    })

  cy.get('.advanced-design-options .vcv-ui-form-group-heading')
    .contains('Animate')
    .then(($field) => {
      if (settings.animation) {
        cy.wrap($field)
          .next()
          .select(settings.animation)
      }
    })
})

// Set Design Options Advanced
Cypress.Commands.add('setDOA', (settings) => {
  cy.get('.vcv-ui-form-switch-trigger-label')
    .contains('Use gradient overlay')
    .then(($field) => {
      cy.wrap($field)
        .click()
    })

  cy.get('.vcv-ui-form-group-heading')
    .contains('Gradient type')
    .then(($field) => {
      if (settings.gradientType) {
        cy.wrap($field)
          .next()
          .select(settings.gradientType)
      }
    })

  cy.get('.vcv-ui-form-group-heading')
    .contains('Start color')
    .then(($field) => {
      if (settings.gradientStartColor.hex) {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="E28787"]')
          .clear()
          .type(settings.gradientStartColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      }
    })

  cy.get('.vcv-ui-form-group-heading')
    .contains('End color')
    .then(($field) => {
      if (settings.gradientEndColor.hex) {
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
        cy.get('.vcv-ui-color-picker-custom-color input[value="5D37D8"]')
          .clear()
          .type(settings.gradientEndColor.hex)
        cy.wrap($field)
          .next('div')
          .find('.vcv-ui-color-picker-dropdown')
          .click()
      }
    })

  cy.get('.vcv-ui-form-group-heading')
    .contains('Gradient angle')
    .then(($field) => {
      if (settings.gradientAngle) {
        cy.wrap($field)
          .next()
          .find('.vcv-ui-form-range-input')
          .clear()
          .type(settings.gradientAngle)
      }
    })
})
