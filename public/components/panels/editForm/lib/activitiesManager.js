import React from 'react'
import lodash from 'lodash'
import { getService } from 'vc-cake'
import PropTypes from 'prop-types'
import EditForm from 'public/components/panels/editForm/lib/editForm'

const RulesManager = getService('rulesManager')
const ActionsManager = getService('actionsManager')

export default class ActivitiesManager extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    activeTabId: PropTypes.string,
    options: PropTypes.object
  }

  mount = {}
  stack = {}
  mountStack = {}
  initialStack = {}

  constructor (props) {
    super(props)
    this.handleAttributeChange = this.handleAttributeChange.bind(this)
    this.listeners = this.initListeners(this.props.elementAccessPoint.cook(), props)
  }

  shouldComponentUpdate (nextProps) {
    const isEqualId = lodash.isEqual(nextProps.id, this.props.id)
    const isEqualNestedId = lodash.isEqual(nextProps?.options?.parentElementId, this.props?.options?.parentElementId)
    if (!isEqualId || !isEqualNestedId) {
      this.mount = {}
      this.stack = {}
      this.mountStack = {}
      this.initialStack = {}
      this.listeners = this.initListeners(nextProps.elementAccessPoint.cook(), nextProps)
    }
    return true
  }

  initListeners (cookElement, props = false) {
    const listeners = []
    let fields = Object.keys(cookElement.getAll(false))
    if (props.options && props.options.nestedAttr) {
      fields = Object.keys(cookElement.settings(props.options.fieldKey).settings.options.settings)
    }
    fields.forEach(key => {
      let onChangeRules = this.getOnChange(cookElement.settings(key)).rules
      if (props.options && props.options.nestedAttr) {
        const attrSettings = cookElement.settings(props.options.fieldKey).settings.options.settings
        onChangeRules = this.getOnChange(cookElement.settings(key, attrSettings)).rules
      }
      if (onChangeRules) {
        Object.keys(onChangeRules).forEach(keyOnChange => {
          if (!listeners[keyOnChange]) {
            listeners[keyOnChange] = []
          }
          listeners[keyOnChange].push({ key })
          this.addInitialStack(key, keyOnChange)
        })
      }
    })
    return listeners
  }

  getOnChange (data) {
    return (
      data &&
      data.settings &&
      data.settings.options &&
      data.settings.options.onChange ? data.settings.options.onChange : {}
    )
  }

  setFieldMount = (fieldKey, data, type = 'field') => {
    if (!this.mount[fieldKey]) {
      this.mount[fieldKey] = {}
    }
    data.key = fieldKey
    data.type = type
    this.mount[fieldKey][type] = data
    this.callInitialStack(fieldKey)
    this.callMountStack(fieldKey)
  }

  handleAttributeChange (key) {
    this.callFieldActivities(null, key)
  }

  setFieldUnmount = (fieldKey, type) => {
    if (type && this.mount[fieldKey]) {
      delete this.mount[fieldKey][type]
      if (this.stack[fieldKey] && this.stack[fieldKey][type]) {
        delete this.stack[fieldKey][type]
      }
    } else if (this.mount[fieldKey]) {
      delete this.mount[fieldKey].field

      // Clear stack on unmount
      if (this.stack[fieldKey] && this.stack[fieldKey].field) {
        delete this.stack[fieldKey].field
      }
    }
  }

  callFieldActivities = (targetKey, field) => {
    if (this.listeners[field]) {
      lodash.each(this.listeners[field], (listener) => {
        if (this.mount[listener.key] && (!targetKey || listener.key === targetKey)) {
          this.addStack(listener, field)
        }
      })
    }
    if (this.stack[field]) {
      this.stack[field] = this.stack[field].filter(this.callStack.bind(this, field))
    }
  }

  callMountStack = (targetKey) => {
    if (this.mountStack[targetKey]) {
      this.mountStack[targetKey] = this.mountStack[targetKey].filter(this.callFieldActivities.bind(this, targetKey))
    }
  }

  callInitialStack = (targetKey) => {
    if (this.initialStack[targetKey]) {
      this.initialStack[targetKey].map(this.callFieldActivities.bind(this, targetKey))
    }
  }

  addStack (listener, fieldKey) {
    if (!this.stack[fieldKey]) {
      this.stack[fieldKey] = []
    }
    this.stack[fieldKey].push(listener)
  }

  addMountStack (listener, targetKey) {
    if (!this.mountStack[listener.key]) {
      this.mountStack[listener.key] = []
    }
    this.mountStack[listener.key].push(targetKey)
  }

  addInitialStack (key, target) {
    if (!this.initialStack[key]) {
      this.initialStack[key] = []
    }
    this.initialStack[key].push(target)
  }

  callStack = (targetKey, listener) => {
    if (!this.mount[listener.key]) {
      this.addMountStack(listener, targetKey)
      return true
    }

    const { elementAccessPoint } = this.props
    const cookElement = elementAccessPoint.cook()
    const element = cookElement.toJS()
    const keys = Object.keys(this.mount[listener.key]) // field, tab, dropdown

    const actionsCallback = (ruleState, listener) => {
      let actions = this.getOnChange(cookElement.settings(listener.key)).actions
      if (this.props.options && this.props.options.nestedAttr) {
        const attrSettings = cookElement.settings(this.props.options.fieldKey).settings.options.settings
        const elSettings = cookElement.settings(listener.key, attrSettings)
        actions = this.getOnChange(elSettings).actions
      }
      if (actions) {
        keys.forEach((type) => {
          actions.forEach((action) => {
            const mountedWrapper = this.mount[listener.key][type]
            if(mountedWrapper) {
              mountedWrapper.value = element[listener.key]
            ActionsManager.do(action, ruleState, mountedWrapper, cookElement)
            }
          })
        })
      }
    }

    let fieldSettings = cookElement.settings(listener.key)
    if (this.props.options && this.props.options.nestedAttr) {
      const attrSettings = cookElement.settings(this.props.options.fieldKey).settings.options.settings
      fieldSettings = cookElement.settings(listener.key, attrSettings)
    }
    const rules = this.getOnChange(fieldSettings).rules
    const isNested = this.props.options && this.props.options.nestedAttr
    let values = element
    if (isNested) {
      values = element[this.props.options.fieldKey].value[this.props.options.activeParamGroupIndex]
    }

    if (rules) {
      RulesManager.check(values, rules, (status) => {
        actionsCallback(status, listener)
      })
    }

    return false
  }

  render () {
    const { activeTabId, options, elementAccessPoint } = this.props

    return (
      <EditForm
        activeTabId={activeTabId}
        elementAccessPoint={elementAccessPoint}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        onAttributeChange={this.handleAttributeChange}
        callFieldActivities={this.callFieldActivities}
        ref={ref => { this.formWrapper = ref }}
        options={options}
      />
    )
  }
}
