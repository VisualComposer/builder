import React from 'react'

class Attribute extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value
    })
  }

  componentDidMount () {
    let { updater, fieldKey } = this.props
    let { value } = this.state
    updater(fieldKey, value)
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
Attribute.propTypes = {
  updater: React.PropTypes.func.isRequired,
  fieldKey: React.PropTypes.string.isRequired,
  value: React.PropTypes.any,
  options: React.PropTypes.any
}

module.exports = Attribute
