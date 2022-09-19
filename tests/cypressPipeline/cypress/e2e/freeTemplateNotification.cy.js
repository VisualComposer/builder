/* global describe, it, cy */

describe('Free template notification', function () {
    it('Check if notification shows up', function () {

        cy.visit('/wp-admin/admin.php?page=vcv-hub')
        cy.wait(200)

        cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
        cy.window().then((win) => {
          cy.route('POST', win.vcvAdminAjaxUrl).as('downloadRequest')
        })
        cy.get('img[alt="Simple Blog Article"]').next().find('.vcv-ui-item-add').click()
        cy.wait('@downloadRequest')

        cy.visit(Cypress.env('newPage'))
        cy.window().then((win) => {
          cy.route('POST', win.vcvAdminAjaxUrl).as('loadContentRequest')
        })
        cy.wait('@loadContentRequest')
        cy.wait(1000)
        cy.get('.blank-page-submit-button').click()

        cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
        cy.get('img[alt="Simple Blog Article"]').should('exist')

    }
    )})
