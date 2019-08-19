import React from 'react'
import Attribute from '../attribute'

export default class Datalist extends Attribute {
  static defaultProps = {
    fieldType: 'datalist'
  }

  selectChildren = null

  UNSAFE_componentWillReceiveProps (nextProps) {
    super.UNSAFE_componentWillReceiveProps(nextProps)
    this.generateSelectChildren(nextProps)
  }

  UNSAFE_componentWillMount () {
    this.generateSelectChildren(this.props)
  }

  createOptions (key, values, fieldKey) {
    let value = values[ key ].value
    let label = values[ key ].label
    return <option key={fieldKey + ':' + key + ':' + value} value={value}>{label}</option>
  }

  getSelectOptions (props) {
    if (!props) {
      props = this.props
    }
    let { values } = props.options || {}
    let { global } = props.options || {}
    if (global && (!values || !values.length)) {
      if (typeof window[ global ] === 'function') {
        values = window[ global ]()
      } else {
        values = window[ global ] || []
      }
    }

    return values
  }

  generateSelectChildren (props) {
    let optionElements = []
    let values = this.getSelectOptions(props)
    let { fieldKey } = props

    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }

    this.selectChildren = optionElements
  }

  render () {
    let { value } = this.state
    return (
      <React.Fragment>
        <input className='vcv-ui-form-datalist' list={`vcv-data-list-${this.props.fieldKey}`} type='text' value={value} onChange={this.handleChange} />
        <datalist id={`vcv-data-list-${this.props.fieldKey}`}>
          {this.selectChildren}
        </datalist>
      </React.Fragment>
    )
  }
}
