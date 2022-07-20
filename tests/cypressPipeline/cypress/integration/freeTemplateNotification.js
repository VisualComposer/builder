/* global describe, it, cy */

describe('Free template notification', function () {
    it('Check if notification shows up', function () {


        cy.contains('.wp-menu-name', 'Visual Composer').click()
        cy.contains('.vcv-dashboard-sidebar-navigation-link', 'Visual Composer Hub').click()

        cy.wait(500000)
    }
    )})