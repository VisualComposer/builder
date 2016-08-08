import React from 'react'
import Attribute from '../attribute'

export default class Dropdown extends Attribute {
  selectChilds = null

  componentWillReceiveProps (nextProps) {
    this.generateSelectChilds(nextProps)
  }

  componentWillMount () {
    this.generateSelectChilds(this.props)
  }

  generateSelectChilds (props) {
    let optionElements = []
    let { values } = props.options
    let { fieldKey } = props

    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        let value = values[ key ].value
        let label = values[ key ].label
        optionElements.push(<option key={fieldKey + ':' + key + ':' + value} value={value}>{label}</option>)
      }
    }

    this.selectChilds = optionElements
  }

  render () {
    let { value } = this.state

    return (
      <select
        value={value}
        onChange={this.handleChange}
        className='vcv-ui-form-dropdown'>
        {this.selectChilds}
      </select>
    )
  }
}
