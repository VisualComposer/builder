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
    const { fieldKey, updater, fieldType, dynamicTemplate } = this.props

    const dynamicFieldsList = getDynamicFieldsList(fieldType)
    const dynamicFieldKey = dynamicFieldsList[ 0 ] ? dynamicFieldsList[ 0 ].key : ''

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

    updater(fieldKey, newValue, this.state.value)
  }

  handleDynamicFieldChange (e) {
    const dynamicFieldValue = e.currentTarget && e.currentTarget.value
    const { fieldKey, updater, dynamicTemplate } = this.props

    let newValue = null
    if (dynamicTemplate) {
      newValue = dynamicTemplate.replace('$dynamicFieldKey', dynamicFieldValue)
    } else {
      const currentValue = getDynamicFieldsData(
        {
          blockAtts: {
            value: dynamicFieldValue
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
        value: dynamicFieldValue,
        currentValue: currentValue
      })} -->`
    }

    updater(fieldKey, newValue)
  }

  handleDynamicFieldClose (e) {
    e && e.preventDefault && e.preventDefault()
    const { fieldKey, elementAccessPoint, updater, prevValue } = this.props

    let cookElement = elementAccessPoint.cook()

    let { settings } = cookElement.settings(fieldKey)
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === 'undefined' && settings.value) {
      defaultValue = settings.value
    } else if (prevValue) {
      defaultValue = prevValue
    }
    updater(fieldKey, defaultValue, null)
  }

  render () {
    // This method will be overwritten
    return (
      <div />
    )
  }
}
