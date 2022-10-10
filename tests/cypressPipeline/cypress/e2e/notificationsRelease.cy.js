/* global describe, it, cy */

describe('Notifications section automation for release checklist', function () {
    it('Check notifications in release checklist', function () {

        cy.createPage()
        cy.get('.vcv-ui-navbar-control-content').contains('Insights & Notifications').click({ force: true })
        cy.get('.vcv-insight-title').contains('No content found')
        cy.get('.vcv-insight-description').contains('It seems this page has no content. Make sure to add elements or templates.')

        cy.addElement('Text Block', true)
        cy.addElement('Single Image')

        cy.get('.vcv-ui-navbar-control-content').contains('Insights & Notifications').click({ force: true })
        cy.wait(2000)
        cy.get('.vcv-insight-description').should('not.have.text','It seems this page has no content. Make sure to add elements or templates.')

        cy.contains('The image ALT attribute is missing').parent().parent().find('.vcv-insight-collapse-button').click()
        cy.contains('Alt attribute is empty (Single Image)').parent().parent().find('.vcv-ui-icon-edit').click()

        cy.get('.vcv-ui-edit-form-section-content')

        cy.get('.vcv-ui-navbar-control-content').contains('Insights & Notifications').click({ force: true })
        cy.get('.vcv-insight-title').contains('More than one H1 tag found')

        cy.get('.vcv-ui-navbar-control-content').contains('Options').click({ force: true })
        cy.get('#vcv-page-title-disable').click({force:true})

        cy.get('.vcv-ui-navbar-control-content').contains('Insights & Notifications').click({ force: true })
        cy.wait(2000)
        cy.get('.vcv-insight-description').should('not.have.text', 'More than one H1 tag found')


    })
})
