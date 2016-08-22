import vcCake from 'vc-cake'
import ReactDOM from 'react-dom'

const ActionsManager = {
  do: (actionData, state, target) => {
    let { action, options } = actionData
    ActionsManager.actions[ action || 'ping' ].call(ActionsManager, state, target, options)
  },
  actions: {
    ping: (state, target, options) => {
      console.log('ping', state, target, options)
    },
    alert: (state, target, options) => {
    },
    toggleVisibility: (state, target, options) => {
      // TODO: Same for tabs
      let $el = ReactDOM.findDOMNode(target.ref)
      $el.classList.toggle('vcv-ui-state--visible', state)
      $el.classList.toggle('vcv-ui-state--hidden', !state)

      /* let $plate = $el.closest('.vcv-ui-editor-plate')
      let hideTab = $plate.querySelectorAll('.vcv-ui-form-dependency').length ===
        $plate.querySelectorAll('.vcv-ui-form-dependency.vcv-ui-state--hidden').length
      let index = Array.prototype.indexOf.call($plate.parentElement.children, $plate)
      let $tab = ReactDOM.findDOMNode(target.getRefTab(index))
      $tab.classList.toggle('vcv-ui-state--hidden', hideTab) */
    },
    preset: (state, target, options) => {
    }
  }
}

vcCake.addService('actions-manager', ActionsManager)
