/* global describe, it, cy, Cypress */

const ELEMENT_NAME = 'Single Image'

describe('Hub Panel', function () {
    it('Open Hub Panel, add an search element, toggle between tabs', function () {
        cy.fixture('../fixtures/hubPanel.json').then((settings) => {
            cy.createPage()

        // Open Hub panel
        cy.get('.vcv-ui-navbar-control[title="Hub"]').click({ force: true })

        // Open Elements Tab
        cy.get('.vcv-ui-form-button-group-item').eq(1).find('.vcv-ui-form-button-group-dropdown-item').eq(0).click({ force: true })
        // Add existing element
        cy.get(`.vcv-ui-item-element[title="${ELEMENT_NAME}"]`).find('.vcv-ui-item-add').click()

        // Set Element ID
        cy.get('.vcv-ui-form-group-heading')
        .contains('Element ID')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .type(settings.customId)
        })

        // Set Element Class
        cy.get('.vcv-ui-form-group-heading')
        .contains('Extra class name')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .type(settings.customClass)
        })
        
        // Open Hub panel
        cy.get('.vcv-ui-navbar-control[title="Hub"]').click({ force: true })

        // Search for an element
        cy.get('.vcv-ui-editor-search-field')
            .type(`${ELEMENT_NAME}`)
            .then(($field) => {
            cy.wrap($field)
            .clear()
        })

        // Toggle between tabs
        cy.get('.vcv-ui-form-button-group-item .vcv-ui-form-button').each(function ($tab) {
            cy.wrap($tab)
            .click()

            // Tab content control
            if ($tab.text() == 'Stock Images') {
                cy.get('.vcv-stock-images-results-container')
                .then(($container) => {
                    if (!$container.find('.vcv-stock-image-wrapper').length) {
                        throw new Error('Did not find 1 element in item list')
                    }
                })
            } else {
                cy.get('.vcv-ui-tree-content-section')
                .then(($container) => {
                    if (!$container.find('.vcv-ui-item-list-item').length) {
                        throw new Error('Did not find 1 element in item list')
                    }
                })
            }
        })

        // Save the page and check elements on the View page.
        cy.savePage()
        cy.viewPage()

        cy.get(`#${settings.customId}`)
        .should('have.class', settings.customClass)
    })
    })
})