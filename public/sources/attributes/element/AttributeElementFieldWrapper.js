import React from 'react'
import lodash from 'lodash'
import EditFormField from './lib/field'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'

const RulesManager = getService('rulesManager')
const ActionsManager = getService('actionsManager')

export default class AttributeElementFieldWrapper extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    activeTabId: PropTypes.string,
    options: PropTypes.object,
    exclude: PropTypes.array
  }

  static mount = {}
  static stack = {}
  static mountStack = {}
  static initialStack = {}

  constructor (props) {
    super(props)
    this.handleAttributeChange = this.handleAttributeChange.bind(this)
    this.listeners = this.initListeners(this.props.elementAccessPoint.cook(), props)
  }

  field = (field) => {
    if (field.key === 'designOptions' || field.key === 'metaCustomId') {
      return
    }

    if (this.props.exclude && this.props.exclude.length && this.props.exclude.indexOf(field.key) >= 0) {
      return
    }

    return (
      <EditFormField
        {...this.props}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        onAttributeChange={this.handleAttributeChange}
        key={`element-edit-form-field-${this.props.elementAccessPoint.id}-${field.key}`}
        fieldKey={field.key}
        fieldType={field.data.type.name || field.data.settings.type}
        updater={this.onElementChange}
      />
    )
  }

  onElementChange = (key, value) => {
    this.props.elementAccessPoint.set(key, value)
    this.callFieldActivities(null, key)
    this.props.onChange()
  }

  render () {
    const content = []

    this.props.allTabs.forEach((tab) => {
      const plateClass = classNames({}, `vcv-ui-editor-plate-${tab.id}`)
      content.push(
        <div key={`element-plate-visible-${this.props.elementAccessPoint.id}-${tab.id}`} className={plateClass}>
          {tab.params.map(this.field)}
        </div>
      )
    })

    return (
      <div>{content}</div>
    )
  }

  /* eslint-enable */
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
    if (!AttributeElementFieldWrapper.mount[fieldKey]) {
      AttributeElementFieldWrapper.mount[fieldKey] = {}
    }
    if (typeof AttributeElementFieldWrapper.mount[fieldKey][type] !== 'undefined') {
      return // already mounted
    }
    data.key = fieldKey
    data.type = type
    AttributeElementFieldWrapper.mount[fieldKey][type] = data
    this.callInitialStack(fieldKey)
    this.callMountStack(fieldKey)
  }

  handleAttributeChange (key) {
    this.callFieldActivities(null, key)
  }

  setFieldUnmount = (fieldKey, type) => {
    if (type && AttributeElementFieldWrapper.mount[fieldKey]) {
      delete AttributeElementFieldWrapper.mount[fieldKey][type]
      if (AttributeElementFieldWrapper.stack[fieldKey] && AttributeElementFieldWrapper.stack[fieldKey][type]) {
        delete AttributeElementFieldWrapper.stack[fieldKey][type]
      }
    } else if (AttributeElementFieldWrapper.mount[fieldKey]) {
      delete AttributeElementFieldWrapper.mount[fieldKey].field

      // Clear stack on unmount
      if (AttributeElementFieldWrapper.stack[fieldKey] && AttributeElementFieldWrapper.stack[fieldKey].field) {
        delete AttributeElementFieldWrapper.stack[fieldKey].field
      }
    }
  }

  callFieldActivities = (targetKey, field) => {
    if (this.listeners[field]) {
      lodash.each(this.listeners[field], (listener) => {
        if (AttributeElementFieldWrapper.mount[listener.key] && (!targetKey || listener.key === targetKey)) {
          this.addStack(listener, field)
        }
      })
    }
    if (AttributeElementFieldWrapper.stack[field]) {
      AttributeElementFieldWrapper.stack[field] = AttributeElementFieldWrapper.stack[field].filter(this.callStack.bind(this, field))
    }
  }

  callMountStack = (targetKey) => {
    if (AttributeElementFieldWrapper.mountStack[targetKey]) {
      AttributeElementFieldWrapper.mountStack[targetKey] = AttributeElementFieldWrapper.mountStack[targetKey].filter(this.callFieldActivities.bind(this, targetKey))
    }
  }

  callInitialStack = (targetKey) => {
    if (AttributeElementFieldWrapper.initialStack[targetKey]) {
      AttributeElementFieldWrapper.initialStack[targetKey].map(this.callFieldActivities.bind(this, targetKey))
    }
  }

  addStack (listener, fieldKey) {
    if (!AttributeElementFieldWrapper.stack[fieldKey]) {
      AttributeElementFieldWrapper.stack[fieldKey] = []
    }
    AttributeElementFieldWrapper.stack[fieldKey].push(listener)
  }

  addMountStack (listener, targetKey) {
    if (!AttributeElementFieldWrapper.mountStack[listener.key]) {
      AttributeElementFieldWrapper.mountStack[listener.key] = []
    }
    AttributeElementFieldWrapper.mountStack[listener.key].push(targetKey)
  }

  addInitialStack (key, target) {
    if (!AttributeElementFieldWrapper.initialStack[key]) {
      AttributeElementFieldWrapper.initialStack[key] = []
    }
    AttributeElementFieldWrapper.initialStack[key].push(target)
  }

  callStack = (targetKey, listener) => {
    if (!AttributeElementFieldWrapper.mount[listener.key]) {
      this.addMountStack(listener, targetKey)
      return true
    }

    const { elementAccessPoint } = this.props
    const cookElement = elementAccessPoint.cook()
    const element = cookElement.toJS()
    const keys = Object.keys(AttributeElementFieldWrapper.mount[listener.key]) // field, tab, dropdown

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
            const mountedWrapper = AttributeElementFieldWrapper.mount[listener.key][type]
            mountedWrapper.value = element[listener.key]
            ActionsManager.do(action, ruleState, mountedWrapper, cookElement)
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
}
