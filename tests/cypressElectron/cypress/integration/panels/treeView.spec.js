/* global describe, it, cy */
const treeViewSelector = '.vcv-ui-navbar-control'

describe('Tree View', function () {
  it('Adds element to the page, check Tree View panel functionality', function () {
    cy.fixture('../fixtures/treeView.json').then((settings) => {
      cy.createPage()
      let vcCakeCypress
      // Inject vcCake cypress hack:
      cy.window().then((win) => {
        (win['vcvWebpackJsonp4x'] = win['vcvWebpackJsonp4x'] || []).push([['vcCakeCypress'], {
          './test/vcCake.js': function (module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__);
            var vc_cake__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('./node_modules/vc-cake/index.js')
            var vc_cake__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(vc_cake__WEBPACK_IMPORTED_MODULE_0__)
            win.vcCakeCypress = vc_cake__WEBPACK_IMPORTED_MODULE_0___default()
          }
        }, [['./test/vcCake.js']]])
        vcCakeCypress = win.vcCakeCypress
      })

      let events = {}

      function waitForEvent (storageName, eventName) {
        events[storageName + ':' + eventName] = false
        return new Cypress.Promise((resolve, reject) => {
          vcCakeCypress.getStorage(storageName).on(eventName, () => {
            setTimeout(() => {
              events[storageName + ':' + eventName] = true

              resolve('done')
            }, 500)
          })
        })
      }

      settings.elements.forEach((element, i) => {
        const isInitial = i === 0
        cy.addElement(element, isInitial)
      })

      cy.contains(treeViewSelector, 'Tree View').click()

      cy.get('.vcv-ui-tree-layout .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', settings.elements.length)

      cy.get('.vcv-ui-tree-layout-action[title="Remove All"]').click()

      // Need to wait to remove all of the elements
      cy.wait(500)

      cy.get('.vcv-ui-tree-layout')
        .should('not.exist')

      settings.elements.forEach((element) => {
        cy.addElement(element)
      })

      cy.contains(treeViewSelector, 'Tree View').click()

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Edit"]')
        .click()

      cy.get('.vcv-ui-form-group-heading')
        .contains('Row')

      cy.contains(treeViewSelector, 'Tree View').click()

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .next().should('not.be.visible')

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-node-expand-trigger')
        .click()

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .next().should('be.visible')

      let promise
      cy.wrap(null).then(() => {
        promise = waitForEvent('elements', 'remove')
      })
      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Remove"]')
        .click()
      cy.wrap(events).then((events) => {
        return promise.then(() => {
          expect(events['elements:remove']).to.be.true
        })
      })

      cy.get('.vcv-ui-tree-layout .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', settings.elements.length - 1)

      cy.wrap(null).then(() => {
        promise = waitForEvent('elements', 'clone')
      })
      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Clone"]')
        .click({ force: true })
      cy.wrap(events).then((events) => {
        return promise.then(() => {expect(events['elements:clone']).to.be.true})
      })

      cy.get('.vcv-ui-tree-layout .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', settings.elements.length)

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-node-expand-trigger')
        .click()

      cy.wrap(null).then(() => {
        promise = waitForEvent('workspace', 'copy')
      })
      cy.get('.vcv-ui-tree-layout-control')
        .next()
        .find('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Copy"]')
        .click({ force: true })
      cy.wrap(events).then((events) => {
        return promise.then(() => {expect(events['workspace:copy']).to.be.true})
      })

      cy.wrap(null).then(() => {
        promise = waitForEvent('workspace', 'paste')
      })
      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Paste"]')
        .click({ force: true })
      cy.wrap(events).then((events) => {
        return promise.then(() => {expect(events['workspace:paste']).to.be.true})
      })

      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .next()
        .find('> .vcv-ui-tree-layout-node-child')
        .its('length')
        .should('be.eq', 2)

      cy.wrap(null).then(() => {
        promise = waitForEvent('workspace', 'hide')
      })
      cy.get('.vcv-ui-tree-layout-control')
        .first()
        .find('.vcv-ui-tree-layout-control-action[title="Hide Element"]')
        .click({ force: true })
      cy.wrap(events).then((events) => {
        return promise.then(() => {expect(events['workspace:hide']).to.be.true})
      })

      cy.wait(500)
      cy.savePage()
      cy.viewPage()

      cy.get('.vce-row-container')
        .its('length')
        .should('be.eq', settings.elements.length - 1)
    })
  })
})
