/* global describe, it, cy */

describe('Inisghts Panel', function () {
  it('Creates page, adds elements, opens insights panel, checks notifications.', function () {
    cy.viewport(1200, 900)
    cy.createPage()

    let vcCakeCypress
    // Inject vcCake cypress hack:
    cy.window().then((win) => {
      (win['vcvWebpackJsonp4x'] = win['vcvWebpackJsonp4x'] || []).push([['vcCakeCypress'], {
        './test/vcCake.js': function (module, __webpack_exports__, __webpack_require__) {
          __webpack_require__.r(__webpack_exports__);
          var vc_cake__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('./node_modules/vc-cake/index.js');
          var vc_cake__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(vc_cake__WEBPACK_IMPORTED_MODULE_0__);
          win.vcCakeCypress = vc_cake__WEBPACK_IMPORTED_MODULE_0___default();
        }
      }, [['./test/vcCake.js']]])
      vcCakeCypress = win.vcCakeCypress
    })

    let waited = false
    function waitForInsights () {
      // return a promise that resolves after 1 second
      return new Cypress.Promise((resolve, reject) => {
        vcCakeCypress.getStorage('insights').on('add', (data) => {
          waited = true
          resolve('done')
        })
      })
    }

    cy.get('.vcv-ui-navbar-control[title="Visual Composer Insights"]')
      .click()

    cy.get('.vcv-ui-panel-heading-text').contains('Visual Composer Insights')

    cy.get('.vcv-ui-insights-spinner')

    cy.wrap(null).then({ timeout: 10000 }, () => {
      expect(vcCakeCypress).to.be.a('object')
      // return a promise to cy.then() that
      // is awaited until it resolves
      return waitForInsights().then((str) => {
        expect(str).to.eq('done')
        expect(waited).to.be.true
      })
    })

    // Check notification count
    cy.get('.vcv-insight').then((elements) => {
      cy.wrap(elements)
        .its('length')
        .should('be.eq', Object.keys(vcCakeCypress.getStorage('insights').state('insights').get()).length)
    })

    // Active tabs count
    cy.get('.vcv-ui-tree-view-content:not(.vcv-ui-state--hidden) .vcv-ui-navigation-slider-button')
      .its('length')
      .should('be.eq', 3) // This might change in the future

    cy.addElement('Text Block')
    cy.addElement('Text Block')
    cy.addElement('Text Block')
    cy.addElement('Text Block')
    cy.addElement('Text Block')
    cy.addElement('Text Block')
    cy.addElement('Text Block')

    waited = false
    cy.get('.vcv-ui-navbar-control[title="Visual Composer Insights"]')
      .click()

    cy.wrap(null).then({ timeout: 10000 }, () => {
      expect(vcCakeCypress).to.be.a('object')
      // return a promise to cy.then() that
      // is awaited until it resolves
      return waitForInsights().then((str) => {
        expect(str).to.eq('done')
        expect(waited).to.be.true
      })
    })

    // Active tabs count
    cy.get('.vcv-ui-tree-view-content:not(.vcv-ui-state--hidden) .vcv-ui-navigation-slider-button')
      .its('length')
      .should('be.eq', 4) // This might change in the future

    cy.contains('.vcv-ui-navigation-slider-button', 'Critical')
      .click()

    cy.contains('.vcv-no-issues-heading', 'No Critical Issues Found')
    cy.contains('.vcv-insight-description', 'There are no critical issues on the page. Congratulations and keep up the good work!')

    cy.addElement('Single Image')

    waited = false
    cy.get('.vcv-ui-navbar-control[title="Visual Composer Insights"]')
      .click()

    cy.wrap(null).then({ timeout: 10000 }, () => {
      expect(vcCakeCypress).to.be.a('object')
      // return a promise to cy.then() that
      // is awaited until it resolves
      return waitForInsights().then((str) => {
        expect(str).to.eq('done')
        expect(waited).to.be.true
      })
    })

    cy.get('.vcv-insights-group-altMissingContent .vcv-insight-collapse-button')
      .click()

    cy.get('.vcv-insights-group-altMissingContent .vcv-insight-go-to-action')
      .click()

    cy.get('.vcv-ui-edit-form-header-title').contains('Single Image')

  })
})
