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
  cy.wait(200)
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

// Set custom class name and custom ID
Cypress.Commands.add('setClassAndId', (id, className) => {
  cy.setInput('Element ID', id)
  cy.setInput('Extra class name', className)
})

// Set input attribute value
Cypress.Commands.add('setInput', (title, value) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(title)
    .then(($field) => {
      cy.wrap($field)
        .next()
        .clear()
        .type(value)
    })
})

// Set toggle attribute value (click on a toggle)
Cypress.Commands.add('setSwitch', (title) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(title)
    .then(($field) => {
      cy.wrap($field)
        .next('.vcv-ui-form-switch-container')
        .find('.vcv-ui-form-switch')
        .click()
    })
})

// Set dropdown attribute value (choose a value from select)
Cypress.Commands.add('setSelect', (title, value) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(title)
    .then(($field) => {
      cy.wrap($field)
        .next()
        .select(value)
    })
})

// Set button group attribute value (click on a button)
Cypress.Commands.add('setButtonGroup', (title, value) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(title)
    .then(($field) => {
      cy.wrap($field)
        .next()
        .find(`.vcv-ui-form-button[data-value="${value}"]`)
        .click()
    })
})

// Set color picker attribute value
Cypress.Commands.add('setColor', (settings) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(settings.title)
    .then(($field) => {
      cy.wrap($field)
        .next('div')
        .find('.vcv-ui-color-picker-dropdown')
        .click()
      cy.get(`.vcv-ui-color-picker-custom-color input[value="${settings.initialValue}"]`)
        .clear()
        .type(settings.value)
      cy.wrap($field)
        .next('div')
        .find('.vcv-ui-color-picker-dropdown')
        .click()
    })
})

// Set link selector attribute value
Cypress.Commands.add('setURL', (title, settings) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(title)
    .then(($field) => {
      cy.wrap($field)
        .next('div')
        .find('.vcv-ui-form-link-button')
        .click()
    })

  cy.get('.vcv-ui-modal .vcv-ui-form-group-heading')
    .contains('URL')
    .then(($field) => {
      cy.wrap($field)
        .next('.vcv-ui-editor-dropdown-input-container')
        .find('input')
        .type(settings.url)
    })

  cy.get('.vcv-ui-modal label[for="targetBlank-0-1"]').click()
  cy.get('.vcv-ui-modal .vcv-ui-modal-action').click()
})

// Set icon picker attribute value
Cypress.Commands.add('setIcon', (title, settings) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(title)
    .then(($field) => {
      cy.wrap($field)
        .next('div')
        .find('.vcv-ui-form-dropdown')
        .click()
    })

  cy.get('.vcv-ui-form-iconpicker-content-heading .vcv-ui-form-dropdown:first-of-type')
    .select(settings.iconFamily)

  cy.get('.vcv-ui-form-iconpicker-content-heading .vcv-ui-form-input')
    .type(settings.iconName)

  cy.get(`.vcv-ui-form-iconpicker-option[title="${settings.iconTitle}"]`)
    .click()
})

// Set htmleditor (TinyMce editor) attribute value
Cypress.Commands.add('setTinyMce', (settings) => {
  cy.get('.vcv-ui-form-group-heading')
    .contains(settings.title)
    .then(($field) => {
      cy.wrap($field)
        .next()
        .find('.vcv-ui-form-wp-tinymce-inner iframe').then(($iframe) => {
        // get body within TinyMCE's iframe content
        const document = $iframe.contents()
        const body = document.find('body')

        cy.wrap(body).focus().clear().type(settings.text)
      })

      // Select which HTML tag will be used from the TinyMCE tag dropdown list
      if (settings.elementType && settings.elementType.name) {
        // The dropdown might contain Heading or Paragraph word when clearing the area.
        const inputValue = /\b(?:Heading|Paragraph)\b/g
        cy.wrap($field)
          .next()
          .find('.mce-stack-layout-item.mce-first .mce-btn .mce-txt')
          .contains(inputValue)
          .closest('button')
          .click()

        cy.get('.mce-menu-item .mce-text')
          .contains(settings.elementType.name)
          .parent()
          .click()
      }

      // Click on TinyMCE alignment control
      if (settings.alignment && settings.alignment.name) {
        cy.wrap($field)
          .next()
          .find(`.mce-btn[aria-label*="${settings.alignment.name}"] button`)
          .click()
      }
    })
})

// Click on the Replace button within a section
Cypress.Commands.add('replaceElement', (settings) => {
  cy.get('.vcv-ui-edit-form-section-header')
    .contains(settings.sectionName)
    .next()
    .find('.vcv-ui-replace-element-block .vcv-ui-form-button')
    .click()

  cy.get('.vcv-ui-replace-element-block .vcv-ui-item-list-item')
    .contains(settings.elementName)
    .click()
})

// Creates a new post in WordPress admin dashboard,
// returns post id
Cypress.Commands.add('createWpPost', (settings) => {
  let postId

  cy.visit('/wp-admin/post-new.php')

  cy.get('.editor-post-title__input')
    .type(settings.postTitle, { force: true })

  cy.get('.editor-default-block-appender__content')
    .click({ force: true })

  cy.get('.block-editor-rich-text__editable')
    .type(settings.postContent, { force: true })

  cy.get('.edit-post-sidebar__panel-tab[data-label="Document"]')
    .click()

  cy.contains('.components-button.components-panel__body-toggle', 'Excerpt')
    .click()

  cy.get('.editor-post-excerpt .components-textarea-control__input')
    .type(settings.postContent, { force: true })

  cy.window().then((window) => {
    postId = window.document.getElementById('post_ID').value
  })

  cy.get('.editor-post-publish-panel__toggle')
    .click()

  cy.get('.editor-post-publish-button')
    .click()

  return postId
})
