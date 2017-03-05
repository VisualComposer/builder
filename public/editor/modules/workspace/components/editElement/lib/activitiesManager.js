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
  mount = {}
  stack = {}
  mountStack = {}
  initialStack = {}

  constructor (props) {
    super(props)
    this.resetIfEditFormClosed = this.resetIfEditFormClosed.bind(this)
  }

  listeners = this.initListeners(this.props.element)

  componentWillUpdate (nextProps) {
    this.mount = {}
    this.stack = {}
    this.mountStack = {}
    this.initialStack = {}
    this.listeners = this.initListeners(nextProps.element)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.element.get('id') !== this.props.element.get('id') || nextProps.activeState !== this.props.activeState
  }

  initListeners (element) {
    let listeners = []
    lodash.forEach(element.getAll(), (value, key) => {
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

  onElementChange = (key, value) => {
    this.props.element.set(key, value)
    if (vcCake.env('FEATURE_INSTANT_UPDATE')) {
      const { element } = this.props
      const elementData = element.toJS()
      if (!vcCake.getData('lockActivity')) {
        vcCake.setData('lockActivity', 'Are you sure?')
        vcCake.onDataChange('barContentEnd:Show', this.resetIfEditFormClosed)
      }
      vcCake.setData(`element:instantMutation:${element.get('id')}`, elementData)
      // api.request('data:instantMutation', elementData, 'update')
    }
    this.callFieldActivities(null, key)
  }

  resetIfEditFormClosed () {
    const { element } = this.props
    vcCake.ignoreDataChange('barContentEnd:Show', this.resetIfEditFormClosed)
    vcCake.setData(`element:instantMutation:${element.get('id')}`, false)
    // api.request('data:instantMutation', false, 'update')
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
      value: this.props.element.get(listener.key)
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
      let actions = this.getActions(this.props.element.settings(listener.key))
      if (actions) {
        keys.forEach((type) => {
          actions.forEach((action) => {
            ActionsManager.do(action, ruleState, {
              ref: current[ type ].ref,
              refComponent: current[ type ].refComponent,
              [type]: current[ type ],
              value: current.value,
              key: current.key
            }, this.props.element)
          })
        })
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
