import React from 'react'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import { env, getStorage } from 'vc-cake'
import classNames from 'classnames'

export default class Field extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    onAttributeChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    let value = props.elementAccessPoint.cook().toJS()[ props.fieldKey ]
    if (props.options && props.options.nestedAttr) {
      value = props.options.activeParamGroup[ props.fieldKey ]
    }
    this.state = {
      value: value,
      dependenciesClasses: [],
      hasInnerFields: false,
      prevValue: null
    }
    this.updateElement = lodash.debounce(this.updateElement.bind(this), 100)
    this.updateValue = this.updateValue.bind(this)
    this.setInnerFieldStatus = this.setInnerFieldStatus.bind(this)
    this.handleDynamicFieldOpen = this.handleDynamicFieldOpen.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
  }

  componentDidMount () {
    this.props.elementAccessPoint.onAttributeChange(this.props.fieldKey, this.updateValue)
    this.props.setFieldMount(this.props.fieldKey, {
      refWrapperComponent: this,
      refWrapper: this.refs.fieldAttributeWrapper,
      refAttributeComponent: this.refs.attributeComponent
    }, 'field')
  }

  componentWillUnmount () {
    this.props.elementAccessPoint.ignoreAttributeChange(this.props.fieldKey, this.updateValue)
    this.props.setFieldUnmount(this.props.fieldKey, 'field')
  }

  updateValue (data) {
    if (!lodash.isEqual(data, this.state.value)) {
      this.setState({
        value: data
      })
    }
  }

  updateElement (fieldKey, value) {
    if (this.props.options.nestedAttr) {
      const { options, elementAccessPoint } = this.props
      options.customUpdater(options.activeParamGroupIndex, elementAccessPoint, fieldKey, value)
      this.props.onAttributeChange(fieldKey)
    } else {
      this.props.elementAccessPoint.set(fieldKey, value)
      this.props.onAttributeChange(fieldKey)
    }
    let newValue = {
      value: value
    }
    if (env('VCV_JS_FT_DYNAMIC_FIELDS')) {
      // TODO: Fix prevValue
      // if (prevValue) {
      //   newValue.prevValue = prevValue
      // }
    }
    this.setState(newValue)
  }

  setInnerFieldStatus () {
    // If field has other fields inside add class to remove margin from parent field
    this.setState({
      hasInnerFields: true
    })
  }

  handleDynamicFieldOpen (e) {
    e && e.preventDefault && e.preventDefault()
    const { elementAccessPoint, fieldKey } = this.props
    const cookElement = elementAccessPoint.cook()
    const { settings } = cookElement.settings(fieldKey)
    const settingsStorage = getStorage('settings')
    const title = settingsStorage.state('pageTitle').get()
    const defaultValue = settings.options.dynamicField && settings.options.dynamicField.fields ? settings.options.dynamicField.fields[ 0 ] : title
    const value = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify({
      type: 'post',
      value: defaultValue
    })} -->${title}<!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->`
    this.updateElement(fieldKey, value, this.state.value)
  }

  handleDynamicFieldChange (e) {
    const dynamicFieldValue = e.currentTarget && e.currentTarget.value
    let parsedValue

    if (dynamicFieldValue === 'title') {
      const settingsStorage = getStorage('settings')
      parsedValue = settingsStorage.state('pageTitle').get()
    }

    const newValue = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify({
      type: 'post',
      value: dynamicFieldValue
    })} -->${parsedValue}<!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->`
    this.updateElement(this.props.fieldKey, newValue)
  }

  handleDynamicFieldClose () {
    const { fieldKey, elementAccessPoint } = this.props
    const { prevValue } = this.state

    if (prevValue) {
      this.updateElement(fieldKey, prevValue)
    } else {
      let cookElement = elementAccessPoint.cook()

      let { settings } = cookElement.settings(fieldKey)
      let defaultValue = settings.defaultValue
      if (typeof defaultValue === `undefined`) {
        defaultValue = settings.value
      }
      this.updateElement(fieldKey, defaultValue)
    }
  }

  render () {
    let { fieldKey, tab, fieldType, elementAccessPoint } = this.props
    let { value } = this.state

    let cookElement = elementAccessPoint.cook()
    let element = cookElement.toJS()
    let classes = classNames({
      'vcv-ui-form-dependency': true
    }, this.state.dependenciesClasses)
    let groupClasses = classNames({
      'vcv-ui-form-group': true,
      'vcv-ui-form-group--has-inner-fields': this.state.hasInnerFields
    })
    if (fieldKey && element) {
      value = element[ fieldKey ]
    }
    let { type, settings } = cookElement.settings(fieldKey)
    if (this.props.options && this.props.options.nestedAttr) {
      let attrSettings = cookElement.settings(this.props.options.fieldKey).settings.options.settings
      let elSettings = cookElement.settings(fieldKey, attrSettings)
      type = elSettings.type
      settings = elSettings.settings
      if (!settings.options) {
        settings.options = {}
      }
      settings.options.nestedAttrPath = `${this.props.options.fieldKey}:${this.props.options.activeParamGroupIndex}:${fieldKey}`
      value = element[ this.props.options.fieldKey ].value[ this.props.options.activeParamGroupIndex ][ fieldKey ]
    }
    let AttributeComponent = type.component
    if (!AttributeComponent) {
      env('VCV_DEBUG') && console.warn(`No component for attribute ${fieldKey}`)
      return null
    }
    if (!settings) {
      throw new Error(`Wrong attribute settings ${fieldKey}`)
    }
    if (!type) {
      throw new Error(`Wrong attribute type ${fieldKey}`)
    }
    const { options } = settings
    const tabTypeName = tab.data.type && tab.data.type.name ? tab.data.type.name : tab.data.type
    let label = ''
    const isOptionsLabel = options && typeof options.label === 'string'
    const isRegularAttributeField = tabTypeName === 'group' && fieldType !== 'paramsGroup'
    const isParamsGroupAttributeField = tabTypeName === 'paramsGroup'
    if (isOptionsLabel && (isRegularAttributeField || isParamsGroupAttributeField)) {
      label = (<span className='vcv-ui-form-group-heading'>{options.label}</span>)
    }
    let description = ''
    if (options && typeof options.description === 'string') {
      description = (<p className='vcv-ui-form-helper'>{options.description}</p>)
    }
    if (options && options.descriptionHTML) {
      description = (<p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: options.descriptionHTML }} />)
    }
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === `undefined`) {
      defaultValue = settings.value
    }

    let dynamicComponent = null
    let fieldComponent = null
    if (env('VCV_JS_FT_DYNAMIC_FIELDS') && typeof value === 'string' && value.indexOf('<!-- wp:vcv-gutenberg-blocks/dynamic-field-block') !== -1) {
      const data = value.split(/(<!-- wp:vcv-gutenberg-blocks\/dynamic-field-block) ([^-]+) -->(.+)(?=<!-- \/wp:vcv-gutenberg-blocks\/dynamic-field-block -->)/g)
      const { value: fieldKey } = data && data[ 2 ] ? JSON.parse(data[ 2 ]) : {}
      const selectOptions = options.dynamicField && options.dynamicField.fields.map((field, index) => {
        return <option key={`dynamic-field-${index}`} value={field}>{field}</option>
      })
      fieldComponent = <select value={fieldKey} onChange={this.handleDynamicFieldChange}>
        {selectOptions}
      </select>
      if (options && options.dynamicField) {
        dynamicComponent = <button type='button' onClick={this.handleDynamicFieldClose}>X</button>
      }
    } else {
      fieldComponent = <AttributeComponent
        key={'attribute-' + fieldKey + element.id}
        options={options}
        value={value}
        defaultValue={defaultValue}
        fieldKey={fieldKey}
        updater={this.updateElement}
        elementAccessPoint={elementAccessPoint}
        fieldType={fieldType}
        setInnerFieldStatus={this.setInnerFieldStatus}
        editFormOptions={this.props.options}
        ref='attributeComponent'
      />

      if (env('VCV_JS_FT_DYNAMIC_FIELDS') && options && options.dynamicField) {
        dynamicComponent = <button type='button' onClick={this.handleDynamicFieldOpen}>Open</button>
      }
    }

    return (
      <div ref='fieldAttributeWrapper' className={classes}>
        <div className={groupClasses} key={`form-group-field-${element.id}-${fieldKey}`}>
          {label}
          {fieldComponent}
          {dynamicComponent}
          {description}
        </div>
      </div>
    )
  }
}
