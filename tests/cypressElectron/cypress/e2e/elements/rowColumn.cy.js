/* global describe, it, cy, expect */

const ELEMENT_NAME = 'Row'

describe(ELEMENT_NAME, function () {
  it('Adds element to the page, checks automatically added elements, checks attributes', function () {
    cy.fixture('../fixtures/rowColumn.json').then((settings) => {
      cy.createPage()
      cy.addElement(ELEMENT_NAME)

      cy.get('.vcv-ui-form-button[data-value="stretchedRowAndColumn"]').click()

      cy.setInput('Column gap', settings.columnGap)
      cy.setSwitch('Full height')
      cy.setButtonGroup('Column position', settings.columnPosition)
      cy.setButtonGroup('Content position', settings.contentPosition)
      cy.setClassAndId(settings.rowCustomId, settings.rowCustomClass)

      cy.get(`.vcv-ui-form-layout-layouts-col[data-index="${settings.rowLayoutControlIndex}"]`).click()

      cy.get('.vcv-ui-form-switch-trigger-label')
        .contains('Enable box shadow')
        .then(($field) => {
          cy.wrap($field)
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Horizontal offset')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.rowBoxShadow.horizontalOffset)
        })
      cy.wait(100)

      cy.get('.vcv-ui-form-group-heading')
        .contains('Vertical offset')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.rowBoxShadow.verticalOffset)
        })
      cy.wait(100)

      cy.get('.vcv-ui-form-group-heading')
        .contains('Blur radius')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.rowBoxShadow.blurRadius)
        })
      cy.wait(100)

      cy.get('.vcv-ui-form-group-heading')
        .contains('Spread radius')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.rowBoxShadow.spreadRadius)
        })
      cy.wait(100)

      cy.get('.vcv-ui-form-group-heading')
        .contains('Shadow color')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
          cy.get('.vcv-ui-color-picker-custom-color input[value="555555"]')
            .clear()
            .type(settings.rowBoxShadow.shadowColor.hex)
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
        })

      cy.get('.vcv-ui-form-switch-trigger-label')
        .contains('Enable top shape divider')
        .then(($field) => {
          cy.wrap($field)
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Divider shape')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-iconpicker-picker-dropdown')
            .click()
          cy.get(`.vcv-ui-form-iconpicker-option[value="vcv-ui-icon-divider ${settings.rowTopDivider.shape}"]`)
            .click()
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-iconpicker-picker-dropdown')
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Flip')
        .then(($field) => {
          cy.wrap($field)
            .next('.vcv-ui-form-buttons-group')
            .find(`.vcv-ui-form-button[data-value="${settings.rowTopDivider.flip}"]`)
            .click()
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Divider size')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.rowTopDivider.size)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Divider form scale')
        .then(($field) => {
          cy.wrap($field)
            .next()
            .find('.vcv-ui-form-range-input')
            .clear()
            .type(settings.rowTopDivider.scale)
        })

      cy.get('.vcv-ui-form-group-heading')
        .contains('Divider background color')
        .then(($field) => {
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
          cy.get('.vcv-ui-color-picker-custom-color input[value="6567DF"]')
            .clear()
            .type(settings.rowTopDivider.backgroundColor.hex)
          cy.wrap($field)
            .next('div')
            .find('.vcv-ui-color-picker-dropdown')
            .click()
        })

      cy.setDO(settings.rowDesignOptions)
      cy.setDOA(settings.rowDesignOptions)

      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.rowCustomId}`)
      cy.get('.vce-row')
        .should('have.class', settings.rowCustomClass)
        .and('have.class', `vce-row--col-gap-${settings.columnGap}`)
        .and('have.class', 'vce-row-full-height')
        .and('have.class', 'vce-row-columns--stretch')
        .and('have.class', 'vce-row-content--middle')
        .should('have.attr', 'data-vce-full-width', 'true')
        .and('have.attr', 'data-vce-stretch-content', 'true')
        .should('have.css', 'box-shadow', `${settings.rowBoxShadow.shadowColor.rgb} ${settings.rowBoxShadow.horizontalOffset}px ${settings.rowBoxShadow.verticalOffset}px ${settings.rowBoxShadow.blurRadius}px ${settings.rowBoxShadow.spreadRadius}px`)
        .and('have.css', 'padding', settings.rowDesignOptions.padding)
        .and('have.css', 'margin', settings.rowDesignOptions.margin)
        .and('have.css', 'border-width', settings.rowDesignOptions.borderWidth)
        .and('have.css', 'border-radius', settings.rowDesignOptions.borderRadius)
        .and('have.css', 'border-style', settings.rowDesignOptions.borderStyle)
        .and('have.css', 'border-color', settings.rowDesignOptions.borderColor.rgb)
        .and('have.css', 'animation-name', `vce-o-animate--${settings.rowDesignOptions.animation}`)
        .should('have.attr', 'data-vce-animate', `vce-o-animate--${settings.rowDesignOptions.animation}`)
        .and('have.attr', 'data-vcv-o-animated', 'true')

      // End color and Start color are switched places because they're switched in PCSS mixin (f371c7a4a9b7a4e2ce1228ece5dde1f34410d065)
      cy.get('.vce-asset-color-gradient-container')
        .should('have.css', 'background-image')
        // TODO: try to fix this assertion, ~50% of the time failing (wrong angle value).
        // .should('have.css', 'background-image', `linear-gradient(${settings.rowDesignOptions.gradientAngle}deg, ${settings.rowDesignOptions.gradientEndColor.rgb}, ${settings.rowDesignOptions.gradientStartColor.rgb})`)
        // OR
        // .then((style) => {
        //   if (style) {
        //     expect(style).to.eq(`linear-gradient(${settings.rowDesignOptions.gradientAngle}deg, ${settings.rowDesignOptions.gradientEndColor.rgb}, ${settings.rowDesignOptions.gradientStartColor.rgb})`)
        //   }
        // })

      cy.window()
        .then((win) => {
          cy.get('.vce-row').then(($row) => {
            let rowWidth = $row[0].style.width
            if (!rowWidth) {
              const firstColumnStyles = win.getComputedStyle($row[0])
              const rowMarginLeft = firstColumnStyles.marginLeft.replace('px', '')
              const rowMarginRight = firstColumnStyles.marginRight.replace('px', '')
              rowWidth = `${$row[0].offsetWidth + parseInt(rowMarginLeft) + parseInt(rowMarginRight)}px`
            }
            expect(rowWidth).to.eq(`${win.document.documentElement.clientWidth}px`)
          })
        })

      cy.get('.vce-row-content')
        .first() // get first one, as Cypress may duplicate this row
        .should('have.css', 'align-content', settings.columnPosition)
        .children()
        .should('have.length', 3)
        .should('have.css', 'display', 'flex')

      cy.get('.vce-col')
        .should('have.css', 'display', 'flex')
        .and('have.css', 'flex', '1 1 0px')
        .then(($cols) => {
          const win = $cols[0].ownerDocument.defaultView
          const firstColumnStyles = win.getComputedStyle($cols[0])
          expect(firstColumnStyles.marginRight).to.eq(`${settings.columnGap}px`)
        })

      cy.get('.vce-col-inner').then(($innerCols) => {
        const win = $innerCols[0].ownerDocument.defaultView
        const firstColumnStyles = win.getComputedStyle($innerCols[0])
        expect(firstColumnStyles.justifyContent).to.eq('center')
      })

      cy.get('.vce-container-divider')
        .should('have.class', 'vce-divider-position--top')
        .and('have.class', 'vce-container-divider-flip--horizontally')

      cy.get('.vce-container-divider-inner')
        .should('have.css', 'transform', 'matrix(-1, 0, 0, 1, 0, 0)')

      cy.get('.vce-divider-svg')
        .should('have.attr', 'width', `${settings.rowTopDivider.scale}%`)
        .find('g')
        .should('have.attr', 'fill', settings.rowTopDivider.backgroundColor.rgb)
    })
  })
})
