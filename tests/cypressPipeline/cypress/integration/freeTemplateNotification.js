/* global describe, it, cy */

describe('Free template notification', function () {
    it('Check if notification shows up', function () {

        cy.contains('.wp-menu-name', 'Visual Composer').click()
        cy.contains('.vcv-dashboard-sidebar-navigation-link', 'Visual Composer Hub').click()

       cy.contains('.vcv-premium-teaser-btn', 'Yes, I agree').click()

        cy.wait(1500)

        cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
        cy.get('img[alt="Simple Blog Article"]').next().find('.vcv-ui-item-add').click()
        //cy.window().then((win) => {
        cy.route({
            method: 'POST',
            url:'http://localhost:8888/dev/wp-admin/admin-ajax.php?vcv-admin-ajax=1&action=vcv-admin-ajax',
        }).as('downloadRequest')
        //})
        cy.wait('@downloadRequest')
        
        cy.wait(40000).visit(Cypress.env('newPage'))
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