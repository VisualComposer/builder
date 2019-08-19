import React from 'react'
import Attribute from '../attribute'

export default class MultipleDropdown extends Attribute {
  static defaultProps = {
    fieldType: 'multipleDropdown'
  }

  selectChildren = null

  UNSAFE_componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)
    this.generateSelectChildren(nextProps)
  }

  UNSAFE_componentWillMount () {
    this.generateSelectChildren(this.props)
  }

  createGroup (key, groupObject, fieldKey) {
    let optionElements = []
    let { values, label } = groupObject
    let labelValue = label.replace(/\s+/g, '')
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }
    return <optgroup key={fieldKey + ':' + key + ':' + labelValue} label={label}>{optionElements}</optgroup>
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
        if (values[ key ].hasOwnProperty('group')) {
          optionElements.push(this.createGroup(key, values[ key ].group, fieldKey))
        } else {
          optionElements.push(this.createOptions(key, values, fieldKey))
        }
      }
    }

    this.selectChildren = optionElements
  }

  handleChange (event) {
    let options = event.target.options
    let value = []
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[ i ].selected) {
        value.push(options[ i ].value)
      }
    }

    this.setFieldValue(value)
  }

  handleMouseDown (e) {
    const el = e.target

    if (el.tagName.toLowerCase() === 'option' && el.parentNode.hasAttribute('multiple')) {
      e.preventDefault()

      // toggle selection
      if (el.hasAttribute('selected')) {
        el.removeAttribute('selected')
      } else {
        el.setAttribute('selected', '')
      }

      // hack to correct buggy behavior
      // let select = el.parentNode.cloneNode(true);
      // el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
  }

  render () {
    let { value } = this.state
    return (
      <select
        multiple
        value={value}
        onChange={this.handleChange}
        onMouseDown={this.handleMouseDown}
        className='vcv-ui-form-input vcv-ui-form-dropdown-multiple'>
        {this.selectChildren}
      </select>
    )
  }
}
