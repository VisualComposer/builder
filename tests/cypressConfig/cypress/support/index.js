// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
/* global Cypress, cy, beforeEach */

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(function () {
  cy.login()
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

// Prevent specs from performing real navigation to external sites (e.g. the
// free-license editor navbar logo, which links to visualcomposer.com). In CI
// that load fails (ERR_FAILED) and aborts the whole run, while it silently
// succeeds locally. Neutralise window.open and any `target="_blank"` clicks.
Cypress.on('window:before:load', (win) => {
  win.open = () => null

  win.addEventListener(
    'click',
    (event) => {
      const anchor = event.target && event.target.closest && event.target.closest('a[target="_blank"]')
      if (anchor) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    },
    true
  )
})
