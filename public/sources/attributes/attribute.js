import React from 'react'

class Attribute extends React.Component {
  state = {
    value: this.normalizeValue(this.props)
  }

  componentWillReceiveProps (nextProps) {
    let value = this.normalizeValue(nextProps)
    this.setState({
      value: value
    })
  }

  normalizeValue (props) {
    return props.value
  }

  componentDidMount () {
    let { updater, fieldKey } = this.props
    let { value } = this.state
    updater(fieldKey, value)
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
Attribute.propTypes = {
  updater: React.PropTypes.func.isRequired,
  fieldKey: React.PropTypes.string.isRequired,
  value: React.PropTypes.any.isRequired,
  options: React.PropTypes.any
}

export default Attribute
