/* global describe, it, cy */

describe('Dynamic fields section automation for release checklist', function () {
    it('Check dynamic fields in release checklist', function () {
        cy.fixture('../fixtures/dynamicFieldsRelease.json').then((settings) => {
            
        cy.visit('/wp-admin/post-new.php?vcv-action=frontend')
        cy.contains('.blank-page-submit-button', 'Get Started').click()

        cy.get('.vcv-ui-navbar-control-content').contains('Options').click({force: true})

        cy.contains('.vcv-ui-form-group-heading', 'Title').next().clear().type(settings.title)
        
        cy.contains('.vcv-ui-form-link', 'add a new category').click()
        cy.contains('.vcv-ui-form-group-heading', 'Category').next().clear().type(settings.category)
        cy.contains('button', 'Add New Category').click()

        cy.contains('.vcv-ui-form-group-heading', 'Tags').next().find('.vc-tags--search-input').clear().type(settings.tag)

        cy.contains('.vcv-ui-form-group-heading', 'Excerpt').next().clear().type(settings.excerpt)

        cy.addElement('Basic Button', true)

        //image??

        cy.savePage()

        cy.url().then(($postUrl) => {
            console.log($postUrl)

        cy.createPage()

        cy.addElement('Basic Button')

        cy.getIframe('#vcv-editor-iframe').find('vcvtitle').then(($title) => {
            const pageTitle = $title.text()

            cy.get('span[title="Insert dynamic content"]').first().click()

            cy.get('header').contains('Dynamic Content').parent().parent().find('select').select('Post Title')
            cy.get('.vcv-ui-modal-action[title="Save"]').click()

            cy.getIframe('#vcv-editor-iframe').find('button').contains(pageTitle)

            cy.contains('.vcv-ui-form-group-heading', 'Button text').parent().parent().find('span[title="Edit dynamic content"]').first().click()
            cy.contains('label', 'Set custom post source').parent().click()

            cy.get('.vcv-ui-tag-list-item-remove[title="Remove"]').click()
            cy.contains('.vcv-ui-form-group-heading', 'Source').parent().parent().find('textarea').click({force:true}).clear().type(settings.title)
            cy.get('.vcv-ui-suggest-box').children().first().click()
            cy.wait(2000)
            cy.get('.vcv-ui-modal-action[title="Save"]').click()


            cy.addElement('Basic Button', true)
            cy.contains('.vcv-ui-form-group-heading', 'Button text').parent().parent().find('span[title="Insert dynamic content"]').first().click()
            cy.contains('label', 'Set custom post source').parent().click()
            cy.get('.vcv-ui-tag-list-item-remove[title="Remove"]').click()
            cy.contains('.vcv-ui-form-group-heading', 'Source').parent().parent().find('textarea').click({force:true}).clear().type(settings.title)
            cy.get('.vcv-ui-suggest-box').children().first().click()
            cy.wait(2000)
            cy.get('header').contains('Dynamic Content').parent().parent().find('select').select('Post Excerpt')
            cy.get('.vcv-ui-modal-action[title="Save"]').click()


            cy.addElement('Basic Button', true)
            cy.contains('.vcv-ui-form-group-heading', 'Button text').parent().parent().find('span[title="Insert dynamic content"]').first().click()
            cy.contains('label', 'Set custom post source').parent().click()
            cy.get('.vcv-ui-tag-list-item-remove[title="Remove"]').click()
            cy.contains('.vcv-ui-form-group-heading', 'Source').parent().parent().find('textarea').click({force:true}).clear().type(settings.title)
            cy.get('.vcv-ui-suggest-box').children().first().click()
            cy.wait(2000)
            cy.get('header').contains('Dynamic Content').parent().parent().find('select').select('Post Tags')
            cy.get('.vcv-ui-modal-action[title="Save"]').click()
            

            cy.addElement('Basic Button', true)
            cy.contains('.vcv-ui-form-group-heading', 'Button text').parent().parent().find('span[title="Insert dynamic content"]').first().click()
            cy.contains('label', 'Set custom post source').parent().click()
            cy.get('.vcv-ui-tag-list-item-remove[title="Remove"]').click()
            cy.contains('.vcv-ui-form-group-heading', 'Source').parent().parent().find('textarea').click({force:true}).clear().type(settings.title)
            cy.get('.vcv-ui-suggest-box').children().first().click()
            cy.wait(2000)
            cy.get('header').contains('Dynamic Content').parent().parent().find('select').select('Post Categories')
            cy.get('.vcv-ui-modal-action[title="Save"]').click()


            cy.getIframe('#vcv-editor-iframe').find('button').contains(settings.title)
            cy.getIframe('#vcv-editor-iframe').find('button').contains(settings.excerpt)
            cy.getIframe('#vcv-editor-iframe').find('button').contains(settings.tag)
            cy.getIframe('#vcv-editor-iframe').find('button').contains(settings.category)

            cy.savePage()
            cy.viewPage()

            cy.get('button').contains(settings.title)
            cy.get('button').contains(settings.excerpt)
            cy.get('button').contains(settings.tag)
            cy.get('button').contains(settings.category)
          })

        cy.url().then(($url) => {
           
            cy.visit($postUrl)
            cy.get('.vcv-ui-navbar-control-content').contains('Options').click({force: true})

            cy.contains('.vcv-ui-form-group-heading', 'Title').next().clear().type(settings.newTitle)
        
            cy.contains('.vcv-ui-form-link', 'add a new category').click()
            cy.contains('.vcv-ui-form-group-heading', 'Category').next().clear().type(settings.newCategory)
            cy.contains('button', 'Add New Category').click()

            cy.contains('.vcv-ui-edit-form-section-header-title', 'Categories').parent().next().contains(settings.category).find('.vcv-ui-form-checkbox-indicator').click()
    
            cy.contains('.vcv-ui-form-group-heading', 'Tags').next().find('.vc-tags--search-input').clear().type(settings.newTag)
    
            cy.contains('.vcv-ui-form-group-heading', 'Excerpt').next().clear().type(settings.newExcerpt)
        })
    })

        })
    })
})