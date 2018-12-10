import React from 'react'
import lodash from 'lodash'
import { getService } from 'vc-cake'
import PropTypes from 'prop-types'

const RulesManager = getService('rulesManager')
const ActionsManager = getService('actionsManager')
const elementAccessPoint = getService('elementAccessPoint')

export default class ActivitiesManager extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    activeState: PropTypes.string
  }
  mount = {}
  stack = {}
  mountStack = {}
  initialStack = {}

  constructor (props) {
    super(props)
    let element = elementAccessPoint.get(props.element.id)
    this.state = {
      element
    }
    this.listeners = this.initListeners(element.cook(), props)
  }

  componentWillUpdate (nextProps) {
    this.mount = {}
    this.stack = {}
    this.mountStack = {}
    this.initialStack = {}
    let element = elementAccessPoint.get(nextProps.element.id)
    this.listeners = this.initListeners(element.cook(), nextProps)
  }

  initListeners (elementCook, props = false) {
    let listeners = []
    let fields = Object.keys(elementCook.getAll(false))
    if (props.options.nestedAttr) {
      fields = elementCook.settings(props.options.fieldKey).settings.options.settings._paramGroupEditFormTab1.value
    }
    fields.forEach(key => {
      let onChange = this.getRules(elementCook.settings(key))
      if (props.options.nestedAttr) {
        let attrSettings = elementCook.settings(props.options.fieldKey).settings.options.settings
        onChange = this.getRules(elementCook.settings(key, attrSettings))
      }
      if (onChange) {
        Object.keys(onChange).forEach(keyOnChange => {
          if (!listeners[ keyOnChange ]) {
            listeners[ keyOnChange ] = []
          }
          listeners[ keyOnChange ].push({ key })
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

  getOptions (data) {
    return (
      data &&
      data.settings &&
      data.settings.options &&
      data.settings.options.onChange &&
      data.settings.options.onChange.options ? data.settings.options.onChange.options : false
    )
  }

  setFieldMount = (field, data, type) => {
    if (!this.mount[ field ]) {
      this.mount[ field ] = {}
    }
    if (type) {
      this.mount[ field ][ type ] = data
    } else {
      this.mount[ field ].field = data
    }
    this.callInitialStack(field)
    this.callMountStack(field)
  }

  onAttributeChange (key) {
    this.callFieldActivities(null, key)
  }

  setFieldUnmount = (field, type) => {
    if (type && this.mount[ field ]) {
      delete this.mount[ field ][ type ]
      if (this.stack[ field ] && this.stack[ field ][ type ]) {
        delete this.stack[ field ][ type ]
      }
    } else if (this.mount[ field ]) {
      delete this.mount[ field ].field

      // Clear stack on unmount
      if (this.stack[ field ] && this.stack[ field ].field) {
        delete this.stack[ field ].field
      }
    }
  }

  callFieldActivities = (targetKey, field) => {
    if (this.listeners[ field ]) {
      lodash.each(this.listeners[ field ], (listener) => {
        if (this.mount[ listener.key ] && (!targetKey || listener.key === targetKey)) {
          this.addStack(listener, field)
        }
      })
    }
    if (this.stack[ field ]) {
      this.stack[ field ] = this.stack[ field ].filter(this.callStack.bind(this, field))
    }
  }

  callMountStack = (targetKey) => {
    if (this.mountStack[ targetKey ]) {
      this.mountStack[ targetKey ] = this.mountStack[ targetKey ].filter(this.callFieldActivities.bind(this, targetKey))
    }
  }

  callInitialStack = (targetKey) => {
    if (this.initialStack[ targetKey ]) {
      this.initialStack[ targetKey ].map(this.callFieldActivities.bind(this, targetKey))
    }
  }

  addStack (listener, field) {
    if (!this.stack[ field ]) {
      this.stack[ field ] = []
    }
    this.stack[ field ].push(listener)
  }

  addMountStack (listener, targetKey) {
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
      this.addMountStack(listener, targetKey)
      return true
    }

    let current = {
      key: listener.key,
      value: this.state.element[ listener.key ]
    }

    if (this.mount[ listener.key ].field) {
      current.field = this.mount[ listener.key ].field
    }
    if (this.mount[ listener.key ].tab) {
      current.tab = this.mount[ listener.key ].tab
    }
    let keys = Object.keys(this.mount[ listener.key ]) // field, tab, dropdown
    keys.forEach((type) => {
      current[ type ] = this.mount[ listener.key ][ type ]
    })
    let actionsCallback = (ruleState, listener) => {
      let actions = this.getActions(this.state.element.cook().settings(listener.key))
      if (this.props.options.nestedAttr) {
        let attrSettings = this.state.element.cook().settings(this.props.options.fieldKey).settings.options.settings
        let elSettings = this.state.element.cook().settings(listener.key, attrSettings)
        actions = this.getActions(elSettings)
      }
      if (actions) {
        keys.forEach((type) => {
          actions.forEach((action) => {
            ActionsManager.do(action, ruleState, {
              ref: current[ type ].ref,
              refComponent: current[ type ].refComponent,
              [ type ]: current[ type ],
              value: current.value,
              key: current.key
            }, this.state.element.cook())
          })
        })
      }
    }

    let fieldSettings = this.state.element.cook().settings(listener.key)
    if (this.props.options.nestedAttr) {
      let attrSettings = this.state.element.cook().settings(this.props.options.fieldKey).settings.options.settings
      fieldSettings = this.state.element.cook().settings(listener.key, attrSettings)
    }
    const rules = this.getRules(fieldSettings)
    const isNested = this.props.options && this.props.options.nestedAttr
    let values = this.state.element.get()
    if (isNested) {
      values = values[ this.props.options.fieldKey ].value[ this.props.options.activeParamGroupIndex ]
    }

    RulesManager.check(values, rules, (status) => {
      actionsCallback(status, listener)
    })

    return false
  }

  render () {
    return null
  }
}
