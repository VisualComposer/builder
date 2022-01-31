import React from 'react'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import { env, getService } from 'vc-cake'
import classNames from 'classnames'
import Tooltip from '../../../tooltip/tooltip'

const dataManager = getService('dataManager')
const { getDynamicValue, getDefaultDynamicFieldKey } = getService('cook').dynamicFields

export default class Field extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string.isRequired,
    onAttributeChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    let value = props.elementAccessPoint.cook().toJS()[props.fieldKey]
    if (props.options && props.options.nestedAttr) {
      value = props.options.activeParamGroup[props.fieldKey]
    }
    this.state = {
      value: value,
      dependenciesClasses: [],
      hasInnerFields: false,
      isFieldLoading: false
    }
    this.updateElement = this.updateElement.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.setInnerFieldStatus = this.setInnerFieldStatus.bind(this)
    this.setLoadingState = this.setLoadingState.bind(this)
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
  }

  setInnerFieldStatus () {
    // If field has other fields inside add class to remove margin from parent field
    this.setState({
      hasInnerFields: true
    })
  }

  setLoadingState (isLoading) {
    this.setState({ isFieldLoading: isLoading })
  }

  // analog for a version_compare in php
  versionCompare (v1, v2, options) {
    var lexicographical = options && options.lexicographical
    var zeroExtend = options && options.zeroExtend
    var v1parts = v1.split('.')
    var v2parts = v2.split('.')

    function isValidPart (x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x)
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push('0')
      while (v2parts.length < v1parts.length) v2parts.push('0')
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number)
      v2parts = v2parts.map(Number)
    }

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
        return 1
      }

      if (v1parts[i] === v2parts[i]) {
        continue
      } else if (v1parts[i] > v2parts[i]) {
        return 1
      } else {
        return -1
      }
    }

    if (v1parts.length !== v2parts.length) {
      return -1
    }

    return 0
  }

  isElementWpVersionActual (settings) {
    let isActual = true
    if (settings.options.wpVersion !== undefined) {
      const result = this.versionCompare(settings.options.wpVersion, window.VCV_WP_VERSION())

      if (result !== 1) {
        isActual = false
      }
    }

    return isActual
  }

  render () {
    const { fieldKey, tab, fieldType, elementAccessPoint, isInnerElementReplaceOpened } = this.props
    const cookElement = elementAccessPoint.cook()
    const element = cookElement.toJS()

    if (!element) {
      console.warn('No element to render edit form fields')
      return
    }

    let { type, settings } = cookElement.settings(fieldKey)
    if (!this.isElementWpVersionActual(settings)) {
      return null
    }

    const classes = classNames({
      'vcv-ui-form-dependency': true
    }, this.state.dependenciesClasses)
    const groupClasses = classNames({
      'vcv-ui-form-group': true,
      'vcv-ui-form-group--has-inner-fields': this.state.hasInnerFields
    })
    let value = null
    let fieldKeyInner = ''
    if (fieldKey && element) {
      value = element[fieldKey]
    }
    if (this.props.options && this.props.options.nestedAttr) {
      const attrSettings = cookElement.settings(this.props.options.fieldKey).settings.options.settings
      const elSettings = cookElement.settings(fieldKey, attrSettings)
      type = elSettings.type
      settings = elSettings.settings
      if (!settings.options) {
        settings.options = {}
      }
      settings.options.nestedAttrPath = `${this.props.options.fieldKey}:${this.props.options.activeParamGroupIndex}:${fieldKey}`
      fieldKeyInner = settings.options.nestedAttrPath
      value = element[this.props.options.fieldKey].value[this.props.options.activeParamGroupIndex][fieldKey]
    }
    const AttributeComponent = type.component
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
    let tooltip = null
    if (options && typeof options.description === 'string') {
      tooltip = (
        <Tooltip>
          {options.description}
        </Tooltip>
      )
    }
    if (isOptionsLabel && (isRegularAttributeField || isParamsGroupAttributeField)) {
      let spinnerHtml = null
      if (this.state.isFieldLoading) {
        spinnerHtml = (
          <span className='vcv-ui-wp-spinner' />
        )
      }
      label = (
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>{options.label}{spinnerHtml}</span>
          {tooltip}
        </div>
      )
    }
    let description = ''
    if (options && options.descriptionHTML) {
      const createMenuUrl = dataManager.get('createMenuUrl')
      const html = options.descriptionHTML.replace('{vcvCreateMenuUrl}', createMenuUrl)
      description = (<p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: html }} />)
    }
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === 'undefined') {
      defaultValue = fieldType === 'element' ? settings.value[fieldKey] : settings.value
    }

    const fieldComponent = (
      <AttributeComponent
        key={`attribute-${fieldKeyInner}-${fieldKey}-${element.id}`}
        options={options}
        value={value}
        defaultValue={defaultValue}
        fieldKeyInner={fieldKeyInner}
        fieldKey={fieldKey}
        fieldType={fieldType}
        updater={this.updateElement}
        elementAccessPoint={elementAccessPoint}
        setInnerFieldStatus={this.setInnerFieldStatus}
        editFormOptions={this.props.options}
        isInnerElementReplaceOpened={isInnerElementReplaceOpened}
        onDynamicFieldChange={(dynamicFieldKey, sourceId, forceSaveSourceId = false) => {
          const newValue = getDynamicValue(dynamicFieldKey, sourceId, null, { forceSaveSourceId, element: elementAccessPoint.cook().toJS(), fieldOptions: options })
          return newValue
        }}
        onDynamicFieldClose={(fieldKey, elementAccessPoint) => {
          return defaultValue
        }}
        onDynamicFieldOpen={({ fieldType, prevAttrDynamicKey }) => {
          const defaultDynamicFieldKey = prevAttrDynamicKey || getDefaultDynamicFieldKey(fieldType)
          const newValue = getDynamicValue(defaultDynamicFieldKey)
          return newValue
        }}
        ref='attributeComponent'
        setLoadingState={this.setLoadingState}
      />
    )

    return (
      <div ref='fieldAttributeWrapper' className={classes}>
        <div className={groupClasses} key={`form-group-field-${element.id}-${fieldKey}`}>
          {label}
          {fieldComponent}
          {description}
        </div>
      </div>
    )
  }
}
