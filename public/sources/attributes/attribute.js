import React from 'react'
import Representer from './representer'

export default class Attribute extends Representer {
  static propTypes = {
    updater: React.PropTypes.func.isRequired,
    api: React.PropTypes.object.isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    defaultValue: React.PropTypes.any,
    options: React.PropTypes.any
  }

  constructor (props) {
    super(props)
    this.state = this.updateState(this.props)

    this.setFieldValue = this.setFieldValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
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
    let { updater, fieldKey } = this.props
    updater(fieldKey, value)
    this.setState({ value: value })
  }

  render () {
    // This method will be overwritten
    return (
      <div />
    )
  }
}
