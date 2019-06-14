import React from 'react'
import PropTypes from 'prop-types'
import { getDynamicFieldsData, getDynamicFieldsList } from 'public/components/dynamicFields/dynamicFields'

export default class Attribute extends React.Component {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    value: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.any
  }

  constructor (props) {
    super(props)
    this.state = this.updateState(this.props)

    this.setFieldValue = this.setFieldValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDynamicFieldOpen = this.handleDynamicFieldOpen.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.updateState(nextProps))
  }

  updateState (props) {
    return {
      value: props.value
    }
  }

  handleChange (event) {
    this.setFieldValue(event.currentTarget.value)
  }

  setFieldValue (value) {
    let { updater, fieldKey, fieldType } = this.props
    this.setState({ value: value })
    window.setTimeout(() => {
      updater(fieldKey, value, null, fieldType)
    }, 0)
  }

  handleDynamicFieldOpen (e) {
    e && e.preventDefault && e.preventDefault()
    const { fieldKey, fieldType, dynamicTemplate } = this.props

    const dynamicFieldsList = getDynamicFieldsList(fieldType)
    const dynamicFieldListValues = Object.values(dynamicFieldsList)
    let dynamicFieldKey = ''

    if (dynamicFieldListValues[ 0 ] && dynamicFieldListValues[ 0 ].group && dynamicFieldListValues[ 0 ].group.values && dynamicFieldListValues[ 0 ].group.values[ 0 ]) {
      dynamicFieldKey = dynamicFieldListValues[ 0 ].group.values[ 0 ].value
    }

    if (this.state.prevAttrDynamicKey) {
      dynamicFieldKey = this.state.prevAttrDynamicKey
    }

    let newValue = null

    if (dynamicTemplate) {
      newValue = dynamicTemplate.replace('$dynamicFieldKey', dynamicFieldKey)
    } else {
      const currentValue = getDynamicFieldsData(
        {
          blockAtts: {
            value: dynamicFieldKey
          }
        },
        {
          fieldKey: fieldKey,
          fieldType: this.props.fieldType,
          fieldOptions: this.props.options
        },
        true
      )
      newValue = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify({
        value: dynamicFieldKey,
        currentValue: currentValue
      })} -->`
    }

    this.setState({
      prevAttrValue: this.state.value
    })
    this.setFieldValue(newValue)
  }

  handleDynamicFieldChange (fieldKey, value) {
    const dynamicFieldKey = value
    this.updateDynamicFieldValues(dynamicFieldKey)
  }

  updateDynamicFieldValues (dynamicFieldKey) {
    const { fieldKey, dynamicTemplate } = this.props
    let newValue = null
    this.setState({
      prevAttrDynamicKey: dynamicFieldKey
    })
    if (dynamicTemplate) {
      newValue = dynamicTemplate.replace('$dynamicFieldKey', dynamicFieldKey)
    } else {
      const currentValue = getDynamicFieldsData(
        {
          blockAtts: {
            value: dynamicFieldKey
          }
        },
        {
          fieldKey: fieldKey,
          fieldType: this.props.fieldType,
          fieldOptions: this.props.options
        },
        true
      )
      newValue = `<!-- wp:vcv-gutenberg-blocks/dynamic-field-block ${JSON.stringify({
        value: dynamicFieldKey,
        currentValue: currentValue
      })} -->`
    }
    this.setFieldValue(newValue)
  }

  handleDynamicFieldClose (e) {
    e && e.preventDefault && e.preventDefault()
    const { fieldKey, elementAccessPoint } = this.props
    let cookElement = elementAccessPoint.cook()

    let { settings } = cookElement.settings(fieldKey)
    let defaultValue
    if (this.state.prevAttrValue) {
      defaultValue = this.state.prevAttrValue
    } else {
      defaultValue = settings.defaultValue
      if (typeof defaultValue === 'undefined' && settings.value) {
        defaultValue = settings.value
      }
    }
    this.setFieldValue(defaultValue)
  }

  render () {
    // This method will be overwritten
    return (
      <div />
    )
  }
}
