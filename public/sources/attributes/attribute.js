import React from 'react'

class Attribute extends React.Component {
  static propTypes = {
    updater: React.PropTypes.func.isRequired,
    api: React.PropTypes.object.isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    defaultValue: React.PropTypes.any,
    options: React.PropTypes.any
  }
  state = this.updateState(this.props)

  componentWillReceiveProps (nextProps) {
    this.setState(this.updateState(nextProps))
  }

  updateState (props) {
    return {
      value: props.value
    }
  }

  handleChange = (event) => {
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

export default Attribute
