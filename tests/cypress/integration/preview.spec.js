/* global describe, it, cy */

describe('test preview is working fine', function () {
  it('Adds element to the page, checks the preview of the page works fine or not', function () {
    cy.createPage()
    cy.addElement('Text Block')
    cy.setTinyMce({
      title: 'Content',
      text: 'Test for Preview'
    })

    cy.setClassAndId('preview-id', 'preview-class')

    cy.setDoColor('Background color', {
      color: {
        "hex": "B93030",
        "rgb": "rgb(185, 48, 48)"
      },
      initialColor: '000000'
    })


    cy.window().then((win) => {
      cy.route('POST', win.vcvAdminAjaxUrl).as('previewRequest')
    })
    cy.get('.vcv-ui-navbar-dropdown-trigger[title="Menu"]').click()
    cy.get('.vcv-ui-navbar-control[title="Preview"]').should('be.visible').click()
    cy.wait('@previewRequest')

    // Check visual composer editor
    cy.get('@previewRequest').should((response) => {
      const previewPageUrl = response.response.body.postData.previewUrl
      cy.visit(previewPageUrl)
    })

    cy.get('#preview-id.preview-class')
      .then((element) => {
        const textContent = element.text()

        expect(textContent).to.equal('Test for Preview')
        cy.get('#preview-id.preview-class .vce-text-block-wrapper').should('have.css', 'background-color', 'rgb(185, 48, 48)')
      })

  })
})
