import vcCake from 'vc-cake'
import ReactDOM from 'react-dom'
import lodash from 'lodash'

const ActionsManager = {
  do: (actionData, state, target, element) => {
    let { action, options } = actionData
    ActionsManager.actions[ action || 'ping' ].call(ActionsManager, state, target, options, element)
  },
  actions: {
    ping: (state, target, options) => {
      console.log('ping', state, target, options)
    },
    alert: (state, target, options) => {
    },
    toggleVisibility: (state, target, options) => {
      if (typeof options !== 'undefined') {
        // Reverse state
        state = options ? !state : state
      }
      let $el = ReactDOM.findDOMNode(target.ref)
      $el.classList.toggle('vcv-ui-state--visible', state)
      $el.classList.toggle('vcv-ui-state--hidden', !state)
      lodash.delay(() => {
        ActionsManager.actions.checkTabsDropdown.call(this, state, target, options)
      }, 50)
    },
    checkTabsDropdown: (state, target, options) => {
      let $el = ReactDOM.findDOMNode(target.ref)
      let $form = $el.closest('.vcv-ui-tree-content')
      if ($form) {
        let $dropdownContent = $form.querySelector('.vcv-ui-editor-tab-dropdown-content')
        if ($dropdownContent) {
          let hideTab = $dropdownContent.querySelectorAll('.vcv-ui-form-dependency').length ===
            $dropdownContent.querySelectorAll('.vcv-ui-form-dependency.vcv-ui-state--hidden').length

          $dropdownContent.parentNode.classList.toggle('vcv-ui-state--hidden', hideTab)
        }
      }
    },
    attachImageUrls: (state, target, options, element) => {
      if (element.settings(target.key).settings.options.url === state) {
        return
      }
      element.settings(target.key).settings.options.url = state
      target.refComponent.forceUpdate()
    },
    fieldMethod: (state, target, options, element) => {
      if (
        target.field && target.field.refDomComponent &&
        target.field.refDomComponent.refs &&
        target.field.refDomComponent.refs.domComponent &&
        target.field.refDomComponent.refs.domComponent[ options.method ]
      ) {
        target.field.refDomComponent.refs.domComponent[ options.method ]()
      }
    },
    tabMethod: (state, target, options, element) => {
      if (
        target.tab && target.tab.refDomComponent &&
        target.tab.refDomComponent.refs &&
        target.tab.refDomComponent.refs.domComponent &&
        target.tab.refDomComponent.refs.domComponent[ options.method ]
      ) {
        target.tab.refDomComponent.refs.domComponent[ options.method ]()
      }
    },
    preset: (state, target, options) => {
    }
  }
}

vcCake.addService('actions-manager', ActionsManager)
