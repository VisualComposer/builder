import React from 'react'
import PropTypes from 'prop-types'

export default class Representer extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.any
  }

  constructor (props) {
    super(props)
    this.state = this.updateState(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.updateState(nextProps))
  }

  updateState (props) {
    return {
      value: props.value
    }
  }

  render () {
    // This method will be overwritten
    return (
      <div />
    )
  }
}
