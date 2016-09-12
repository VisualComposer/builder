import React from 'react'

export default class TokenizedList extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired
  }
  state = {
    value: this.props.value
  }
  componentWillReceiveProps (nextProps) {
    this.setState({value: nextProps.value})
  }
  handleChange = (e) => {
    this.setState({value: e.target.value})
    let value = e.target.value.match(/\+$/) ? e.target.value.replace(/\s+\+$/, '') : e.target.value
    if (value.match(/^[\s+\+]/)) {
      value = value.replace(/^[\s+\+]+/, '')
    }
    let layoutSplit = value.split(/[\s,\+;]+/)
    this.props.onChange(layoutSplit)
  }
  render () {
    return <input className='vcv-ui-form-input' type='text' value={this.state.value} onChange={this.handleChange} />
  }
}
