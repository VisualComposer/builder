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
      let $el = ReactDOM.findDOMNode(target.ref)
      $el.classList.toggle('vcv-ui-state--visible', state)
      $el.classList.toggle('vcv-ui-state--hidden', !state)
    },
    preset: (state, target, options) => {
    }
  }
}

vcCake.addService('actions-manager', ActionsManager)
