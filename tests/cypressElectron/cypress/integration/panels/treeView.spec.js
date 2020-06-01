/* global describe, it, cy */

describe('Tree View', function () {
  it('Adds element to the page, check Tree View panel functionality', function () {
    cy.fixture('../../fixtures/treeView.json').then((settings) => {
      cy.createPage()
      settings.elements.forEach((element) => {
        cy.addElement(element)
      })

      cy.get('.vcv-ui-navbar-control[title="Tree View"]').click()

      cy.get('.vcv-ui-tree-layout .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', settings.elements.length)

      cy.get('.vcv-ui-tree-layout-action[title="Remove All"]').click()

      // Need to wait to remove all of the elements
      cy.wait(500)

      cy.get('.vcv-ui-tree-layout')
        .should('not.exist')

      settings.elements.forEach((element) => {
        cy.addElement(element)
      })

      cy.get('.vcv-ui-navbar-control[title="Tree View"]').click()

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Edit"]')
        .click()

      cy.get('.vcv-ui-form-group-heading')
        .contains('Row')

      cy.get('.vcv-ui-navbar-control[title="Tree View"]').click()

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .next().should('not.be.visible')

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-node-expand-trigger')
        .click()

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .next().should('be.visible')

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Remove"]')
        .click()

      // Need to wait to remove the elements
      cy.wait(500)

      cy.get('.vcv-ui-tree-layout .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', settings.elements.length - 1)

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Clone"]')
        .click({ force: true })

      // Need to wait to clone the element
      cy.wait(500)

      cy.get('.vcv-ui-tree-layout .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', settings.elements.length)

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-node-expand-trigger')
        .click()

      cy.get('.vcv-ui-tree-layout-control')
        .next()
        .find('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Copy"]')
        .click({ force: true })

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Paste"]')
        .click({ force: true })

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .next()
        .find('> .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', 2)


      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Hide: Off"]')
        .click({ force: true })

      cy.savePage()
      cy.viewPage()

      cy.get('.vce-row-container')
        .its('length')
        .should('be.eq', settings.elements.length - 1)
    })
  })
})
