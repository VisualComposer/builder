/* global describe, it, cy, expect */

const ELEMENT_NAME = 'Vimeo Player'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/vimeoPlayer.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME, true)

      cy.setInput('Vimeo video link', settings.vimeoLink)
      cy.setButtonGroup('Alignment', settings.alignment)
      cy.setSelect('Size', settings.size)
      cy.setInput('Custom width', settings.customWidth)
      cy.setClassAndId(settings.customId, settings.customClass)
      // cy.setDO(settings.designOptions)

      cy.savePage()
      cy.viewPage()

      cy.get('.vce-vim-video-player')
        .should('have.class', settings.customClass)
        .should('have.css', 'text-align', settings.alignment)
        .should('have.attr', 'id', settings.customId)

      // Disable DO check for performance
      cy.get('.vce-vim-video-player-wrapper')
        .should('have.css', 'width', `${settings.customWidth}px`)
      //   .and('have.css', 'padding', settings.designOptions.padding)
      //   .and('have.css', 'margin', settings.designOptions.margin)
      //   .and('have.css', 'border-radius', settings.designOptions.borderRadius)
      //   .and('have.css', 'border-width', settings.designOptions.borderWidth)
      //   .and('have.css', 'animation-name', `vce-o-animate--${settings.designOptions.animation}`)
      //   .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.designOptions.animation}`)
      //   .and('have.attr', 'data-vcv-o-animated', 'true')

      cy.get('.vce-vim-video-player-iframe')
        .should('have.attr', 'src').then((src) => {
          expect(src).to.have.string(settings.vimeoVideoId)
        })
    })
  })
})
