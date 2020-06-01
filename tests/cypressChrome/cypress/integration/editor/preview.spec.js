/* global describe, it, cy */

describe('Preview', function () {
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

    cy.get('.vcv-ui-navbar-dropdown-trigger[title="Menu"]').click()
    cy.get('.vcv-ui-navbar-control[title="Preview"]').should('be.visible')
    cy.get('.vcv-ui-navbar-control[title="Preview"]').click()
    cy.wait('@loadContentRequest')

    // Check visual composer editor
    cy.get('@loadContentRequest').should((response) => {
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
