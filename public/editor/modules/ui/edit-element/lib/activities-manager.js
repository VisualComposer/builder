import React from 'react'
import lodash from 'lodash'
import vcCake from 'vc-cake'

const RulesManager = vcCake.getService('rules-manager')
const ActionsManager = vcCake.getService('actions-manager')

export default class ActivitiesManager extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    activeState: React.PropTypes.string
  }
  mount = []
  stack = []
  mountStack = []
  initialStack = []
  listeners = this.initListeners(this.props.element)

  componentWillUpdate (nextProps) {
    this.mount = []
    this.stack = []
    this.mountStack = []
    this.initialStack = []
    this.listeners = this.initListeners(nextProps.element)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.element.get('id') !== this.props.element.get('id') || nextProps.activeState !== this.props.activeState
  }

  initListeners (element) {
    let listeners = []
    lodash.forEach(element.data, (value, key) => {
      let onChange = this.getRules(element.settings(key))
      if (onChange) {
        lodash.forEach(onChange, (valueOnChange, keyOnChange) => {
          if (!listeners[ keyOnChange ]) {
            listeners[ keyOnChange ] = []
          }
          listeners[ keyOnChange ].push({ key: key })
          this.addInitialStack(key, keyOnChange)
        })
      }
    })

    return listeners
  }

  getRules (data) {
    return (
      data &&
      data.settings &&
      data.settings.options &&
      data.settings.options.onChange &&
      data.settings.options.onChange.rules ? data.settings.options.onChange.rules : false
    )
  }

  getActions (data) {
    return (
      data &&
      data.settings &&
      data.settings.options &&
      data.settings.options.onChange &&
      data.settings.options.onChange.actions ? data.settings.options.onChange.actions : false
    )
  }

  setFieldMount = (field, data, isTab) => {
    if (!this.mount[ field ]) {
      this.mount[ field ] = {}
    }
    if (isTab) {
      this.mount[ field ].tab = data
    } else {
      this.mount[ field ].field = data
    }
    this.callMountStack(field)
    this.callInitialStack(field)
  }

  onElementChange = (key, value) => {
    this.props.element.set(key, value)
    this.callFieldActivities(key)
  }

  setFieldUnmount = (field, isTab) => {
    if (isTab && this.mount[ field ]) {
      delete this.mount[ field ].tab

      // Clear stack on unmount
      if (this.stack[ field ] && this.stack[ field ].tab) {
        delete this.stack[ field ].tab
      }
    } else if (this.mount[ field ]) {
      delete this.mount[ field ].field

      // Clear stack on unmount
      if (this.stack[ field ] && this.stack[ field ].field) {
        delete this.stack[ field ].field
      }
    }
  }

  callFieldActivities = (field) => {
    if (this.listeners[ field ]) {
      lodash.each(this.listeners[ field ], (listener) => {
        this.addStack(listener, field)
      })
    }
    if (this.stack[ field ]) {
      this.stack[ field ] = this.stack[ field ].filter(this.callStack.bind(this, field))
    }
  }

  callMountStack = (field) => {
    if (this.mountStack[ field ]) {
      this.mountStack[ field ] = this.mountStack[ field ].filter(this.callFieldActivities)
    }
  }

  callInitialStack = (field) => {
    if (this.initialStack[ field ]) {
      this.initialStack[ field ].map(this.callFieldActivities)
    }
  }

  addStack (listener, field) {
    if (!this.stack[ field ]) {
      this.stack[ field ] = []
    }
    this.stack[ field ].push(listener)
  }

  addMountStack (targetKey, listener) {
    if (!this.mountStack[ listener.key ]) {
      this.mountStack[ listener.key ] = []
    }
    this.mountStack[ listener.key ].push(targetKey)
  }

  addInitialStack (key, target) {
    if (!this.initialStack[ key ]) {
      this.initialStack[ key ] = []
    }
    this.initialStack[ key ].push(target)
  }

  callStack = (targetKey, listener) => {
    if (!this.mount[ listener.key ]) {
      this.addMountStack(targetKey, listener)
      return true
    }

    let current = {
      key: listener.key,
      tab: null,
      field: null,
      value: this.props.element.get(listener.key)
    }

    if (this.mount[ listener.key ].field) {
      current.field = this.mount[ listener.key ].field.ref
    }
    if (this.mount[ listener.key ].tab) {
      current.tab = this.mount[ listener.key ].tab.ref
    }

    let actionsCallback = (ruleState, listener) => {
      let actions = this.getActions(this.props.element.settings(listener.key))
      if (actions) {
        if (current.field) {
          actions.forEach((action) => {
            ActionsManager.do(action, ruleState, {
              ref: current.field,
              value: current.value,
              key: current.key
            })
          })
        }
        if (current.tab) {
          actions.forEach((action) => {
            ActionsManager.do(action, ruleState, {
              ref: current.tab,
              value: current.value,
              key: current.key
            })
          })
        }
      }
    }
    RulesManager.check(this.props.element.toJS(), this.getRules(this.props.element.settings(listener.key)), (status) => {
      actionsCallback(status, listener)
    })

    return false
  }

  render () {
    return null
  }
}
