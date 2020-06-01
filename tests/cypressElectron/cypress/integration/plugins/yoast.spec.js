/* global describe, it, cy, Cypress */

describe('Yoast SEO plugin', function () {
  it('Creates page, adds content, check WP page for Yoast SEO plugin compliance.', function () {
    cy.viewport(1200, 800)
    cy.createPage()

    cy.get('.vcv-start-blank-title-input')
      .clear()
      .type('Test Yoast plugin')

    cy.get('.vcv-permalink-editable')
      .clear()
      .type('test-yoast')

    cy.addElement('Text Block')

    cy.setTinyMce({
      title: 'Content',
      text: 'Hello World! How are you doing?', // 6 words
      elementType: {
        name: 'Paragraph'
      }
    })

    cy.savePage()

    cy.window().then((win) => {
      cy.visit(win.vcvPostData.backendEditorUrl)
    })

    cy.get('#wpseo_meta .handlediv')
      .click()

    cy.get('#yoast-seo-analysis-collapsible-metabox')
      .click()

    cy.contains('a', 'Text length')
      .parent()
      .contains(`The text contains 6 words.`)

    cy.contains('a', 'Image alt attributes')
      .parent()
      .contains('No images appear on this page')

    cy.contains('a', 'Outbound links')
      .parent()
      .contains('No outbound links appear in this page')

    cy.window().then((win) => {
      cy.visit(win.vcvFrontendEditorLink)
    })

    cy.get('.vcv-ui-navbar-control[title="Tree View"]').click()

    cy.get('.vcv-ui-tree-layout-control')
      .first()
      .find('.vcv-ui-tree-layout-node-expand-trigger')
      .click()

    cy.contains('.vcv-ui-tree-layout-control-label span', 'Text Block')
      .closest('.vcv-ui-tree-layout-control')
      .find('.vcv-ui-tree-layout-control-action[title="Edit"]')
      .click({ force: true })

    cy.get('#vcv-wpeditor-output-html')
      .click()

    cy.get('#vcv-wpeditor-output')
      .clear()
      .type('Hello World! <a href="https://visualcomposer.com">How</a> are you doing today?')

    cy.addElement('Single Image')

    cy.get('.vcv-ui-navbar-control[title="Update"]').click()
    cy.wait('@saveRequest')

    cy.window().then((win) => {
      cy.visit(win.vcvPostData.backendEditorUrl)
    })

    // Additional refresh for Yoast to gather latest data in Cypress
    cy.reload()

    cy.get('#yoast-seo-analysis-collapsible-metabox')
      .click()

    cy.contains('a', 'Text length')
      .parent()
      .contains(`The text contains 7 words.`)

    cy.contains('a', 'Image alt attributes')
      .parent()
      .contains('Images on this page do not have alt attributes that reflect the topic of your text')

    cy.contains('a', 'Outbound links')
      .parent()
      .contains('Good job!')
  })
})
