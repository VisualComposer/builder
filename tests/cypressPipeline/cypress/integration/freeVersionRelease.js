/* global describe, it, cy */

describe('Free version section automation for release checklist', function () {
    it('Check free version in release checklist', function () {
        cy.fixture('../fixtures/freeVersionRelease.json').then((settings) => {
        cy.createPage()

        cy.contains('.vcv-ui-navbar-control', 'Visual Composer Hub').click()
        cy.contains('.vcv-ui-navigation-slider-button', 'Stock Images').click()

        cy.get('.vcv-stock-image')
            .first()
            .next()
            .should('have.class', 'vcv-stock-image-hover-lock')
            .and('have.attr', 'title', 'Activate Premium to Unlock Unsplash')

        cy.contains('.vcv-ui-navigation-slider-button', 'Giphy').click()

        cy.get('.vcv-stock-image')
            .first()
            .next()
            .should('have.class', 'vcv-stock-image-hover-lock')
            .and('have.attr', 'title', 'Activate Premium to Unlock Giphy Integration')

        //cy.get('.vcv-ui-state--active').find(`img[alt="${settings.premiumElement}"]`).parent().next().find('.vcv-ui-icon-lock-fill')
        cy.searchInHub('Elements', settings.freeElement)
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.freeElement}"]`)
        cy.get('#add-element-search').clear()
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.premiumElement}"]`).parent().find('.vcv-ui-icon-lock-fill')

        cy.searchInHub('Templates', settings.freeTemplate)
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.freeTemplate}"]`)
        cy.get('#add-element-search').clear()
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.premiumTemplate}"]`).parent().find('.vcv-ui-icon-lock-fill')

        cy.searchInHub('Blocks', settings.block)
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.block}"]`)
        
        cy.searchInHub('Addons', settings.addon)
        cy.get('.vcv-ui-state--active').find('.vcv-hub-addon-name').contains(settings.addon)

        cy.searchInHub('Headers', settings.header)
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.header}"]`)

        cy.searchInHub('Footers', settings.footer)
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.footer}"]`)

        cy.searchInHub('Sidebars', settings.sidebar)
        cy.get('.vcv-ui-state--active').find(`img[alt="${settings.sidebar}"]`)
        })
    })
})