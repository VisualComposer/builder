import React from 'react'
import PropTypes from 'prop-types'

export default class Attribute extends React.Component {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    elementAccessPoint: PropTypes.object,
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
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
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

  render () {
    // This method will be overwritten
    return (
      <div />
    )
  }
}
