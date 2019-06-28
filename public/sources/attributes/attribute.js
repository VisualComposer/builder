import React from 'react'
import PropTypes from 'prop-types'

export default class Attribute extends React.Component {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    handleDynamicFieldOpen: PropTypes.func,
    handleDynamicFieldChange: PropTypes.func,
    handleDynamicFieldClose: PropTypes.func,
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
    e && e.preventDefault()
    let newValue = this.props.handleDynamicFieldOpen({
      fieldType: this.props.fieldType,
      prevAttrDynamicKey: this.state.prevAttrDynamicKey
    })

    if (this.state.value && this.state.value.urls) {
      newValue = { ids: [], urls: [ { full: newValue } ] }

      if (this.state.value.urls[ 0 ] && this.state.value.urls[ 0 ].filter) {
        newValue.urls[ 0 ].filter = this.state.value.urls[ 0 ].filter
      }
      if (this.state.value.urls[ 0 ] && this.state.value.urls[ 0 ].link) {
        newValue.urls[ 0 ].link = this.state.value.urls[ 0 ].link
      }
    }

    this.setFieldValue(newValue)
    this.setState({
      prevAttrValue: this.state.value
    })
  }

  handleDynamicFieldChange (_, dynamicFieldKey) {
    let newValue = this.props.handleDynamicFieldChange(dynamicFieldKey)

    if (this.state.value && this.state.value.urls) {
      newValue = { ids: [], urls: [ { full: newValue } ] }

      if (this.state.value.urls[ 0 ] && this.state.value.urls[ 0 ].filter) {
        newValue.urls[ 0 ].filter = this.state.value.urls[ 0 ].filter
      }
      if (this.state.value.urls[ 0 ] && this.state.value.urls[ 0 ].link) {
        newValue.urls[ 0 ].link = this.state.value.urls[ 0 ].link
      }
    }

    this.setFieldValue(newValue)
    this.setState({
      prevAttrDynamicKey: dynamicFieldKey
    })
  }

  handleDynamicFieldClose (e) {
    e && e.preventDefault()
    let newValue = ''
    if (this.state.prevAttrValue) {
      newValue = this.state.prevAttrValue
    } else {
      newValue = this.props.handleDynamicFieldClose(this.props.fieldKey, this.props.elementAccessPoint)
    }
    this.setFieldValue(newValue)
  }

  render () {
    // This method will be overwritten
    return (
      <div />
    )
  }
}
