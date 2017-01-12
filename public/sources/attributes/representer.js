import React from 'react'

export default class Representer extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    defaultValue: React.PropTypes.any,
    options: React.PropTypes.any
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
