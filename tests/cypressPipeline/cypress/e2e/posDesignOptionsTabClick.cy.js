describe('Post design option tab click', function () {
    it('Check if design tab opens after click', function () {
        cy.visit('/wp-admin/post-new.php?vcv-action=frontend')
        cy.contains('.blank-page-submit-button', 'Get Started').click()

        cy.get('.vcv-ui-navbar-control-content').contains('Options').click({ force: true })
        cy.contains('.vcv-ui-navigation-slider-button', 'Design').click()

        //checking if editor shows up
        cy.getIframe('#vcv-editor-iframe').find('vcvtitle').contains('Visual Composer')
        cy.getIframe('#vcv-editor-iframe').find('#vcv-editor')

        //checking if design options tab shows up and has a content
        cy.get('.advanced-design-options').contains('.vcv-ui-form-group-heading', 'Device type')
    })
})