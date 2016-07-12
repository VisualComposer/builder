import React from 'react'
export default class Attribute extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: props.value }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setFieldValue(event.currentTarget.value)
  }

  setFieldValue (value) {
    if (typeof this.props.updater === 'function') {
      this.props.updater(this.props.fieldKey, value)
    }
    this.setState({ value: value })
  }

  render () {
    return <div />
  }
}
Attribute.propTypes = {
  fieldKey: React.PropTypes.string.isRequired,
  value: React.PropTypes.any,
  updater: React.PropTypes.func,
  options: React.PropTypes.any
}
