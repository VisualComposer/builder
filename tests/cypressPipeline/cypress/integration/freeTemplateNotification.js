/* global describe, it, cy */

describe('Free template notification', function () {
    it('Check if notification shows up', function () {

        cy.contains('.wp-menu-name', 'Visual Composer').click()
        cy.contains('.vcv-dashboard-sidebar-navigation-link', 'Visual Composer Hub').click()

        cy.contains('.vcv-premium-teaser-btn', 'Yes, I agree').click()

        cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
        cy.get('img[alt="Simple Blog Article"]').next().find('.vcv-ui-item-add').click()
        // cy.window().then((win) => {
        //     cy.route('POST', win.vcvAdminAjaxUrl).as('loadContentRequest')
        //   })
        //   cy.wait('@loadContentRequest')
        
        cy.createPage()

        cy.wait(10000)

        cy.contains('.vcv-ui-navigation-slider-button', 'Templates').click()
        cy.get('img[alt="Simple Blog Article"]').should('exist')


        
    }
    )})