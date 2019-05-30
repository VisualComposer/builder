import React from 'react'
import Attribute from '../attribute'
import options from './options'

export default class InputSelect extends Attribute {
  static defaultProps = {
    fieldType: 'inputSelect'
  }

  list = null

  constructor (props) {
    super(props)
    this.state = this.updateState(this.props)

    this.handleClick = this.handleClick.bind(this)
    this.toggleSelect = this.toggleSelect.bind(this)
    this.setFieldValue = this.setFieldValue.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
  }

  updateState (props) {
    return {
      input: props.value.input || props.value || props.defaultValue.input,
      select: props.value.select || props.defaultValue.select,
      openedSelect: false
    }
  }

  handleClick (e) {
    e && e.preventDefault()
    if (!this.list.contains(e.target)) {
      this.toggleSelect()
    }
  }

  toggleSelect () {
    if (this.state.openedSelect) {
      document.body.removeEventListener('click', this.handleClick)
    } else {
      document.body.addEventListener('click', this.handleClick)
    }
    this.setState({
      openedSelect: !this.state.openedSelect
    })
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

  createOptions (key, values, fieldKey, type) {
    let value = values[ key ].value
    let label = values[ key ].label
    if (type === 'large') {
      let displayValue = value.replace('_', '')
      let itemClasses = 'vcv-ui-form-input-select-item'
      let activeValue = (this.state && this.state.select) || this.props.value.select
      if (activeValue === value) {
        itemClasses += ' vcv-ui-form-input-select-item-active'
      }
      return (
        <div
          key={fieldKey + ':' + key + ':' + value}
          onClick={this.hangleLargeListClick.bind(this, value)}
          className={itemClasses}>
          <span>
            {displayValue} {label}
          </span>
        </div>
      )
    } else {
      return <option key={fieldKey + ':' + key + ':' + value} value={value}>{label}</option>
    }
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

  getDefaultOptions (props) {
    if (!props) {
      props = this.props
    }
    let { type } = props.options || ''
    if (type && options[ type ]) {
      return options[ type ]
    }
    return []
  }

  generateSelectChildren (props) {
    let optionElements = []
    let defaultValues = this.getDefaultOptions(props)
    let values = [ ...defaultValues, ...this.getSelectOptions(props) ]
    let { fieldKey } = props
    let type = props.options && (props.options.type === 'currency' || props.options.large) ? 'large' : 'small'

    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        if (values[ key ].hasOwnProperty('group') && type === 'small') {
          optionElements.push(this.createGroup(key, values[ key ].group, fieldKey))
        } else {
          optionElements.push(this.createOptions(key, values, fieldKey, type))
        }
      }
    }

    return optionElements
  }

  handleInputChange (event) {
    this.setFieldValue('input', event.target.value)
  }

  handleDropdownChange (event) {
    this.setFieldValue('select', event.target.value)
  }

  hangleLargeListClick (value) {
    this.toggleSelect()
    this.setFieldValue('select', value)
  }

  setFieldValue (key, value) {
    let { updater, fieldKey } = this.props
    let { input, select } = this.state
    let updatedValues = {
      input,
      select,
      [ key ]: value
    }

    updater(fieldKey, updatedValues)
    this.setState({
      [ key ]: value,
      openedSelect: false
    })
  }

  getSelect (props) {
    if (!props) {
      props = this.props
    }
    if (props.options && (props.options.type === 'currency' || props.options.large)) {
      let displayValue = this.state.select.replace('_', '')
      let classNames = 'vcv-ui-form-dropdown vcv-ui-form-input-select'
      if (this.state.openedSelect) {
        classNames += ' vcv-ui-form-state--focus'
      }
      return (
        <div
          className={classNames}
          onClick={this.toggleSelect}>
          {displayValue}
        </div>
      )
    } else {
      let selectChildren = this.generateSelectChildren(props)
      return (
        <select
          value={this.state.select}
          onChange={this.handleDropdownChange}
          className='vcv-ui-form-dropdown'>
          {selectChildren}
        </select>
      )
    }
  }

  getList () {
    if (this.state.openedSelect) {
      let selectChildren = this.generateSelectChildren(this.props)
      return (
        <div className='vcv-ui-form-input-select-list' ref={el => { this.list = el }}>
          {selectChildren}
        </div>
      )
    } else {
      return null
    }
  }

  render () {
    let { input } = this.state
    let { placeholder } = this.props
    if (!placeholder && this.props.options && this.props.options.placeholder) {
      placeholder = this.props.options.placeholder
    }

    let Select = this.getSelect(this.props)
    let List = this.getList()

    return (
      <div className='vcv-ui-form-input-select'>
        <div className='vcv-ui-form-input-group'>
          <input
            className='vcv-ui-form-input'
            type='text'
            onChange={this.handleInputChange}
            placeholder={placeholder}
            value={input}
          />
          {Select}
        </div>
        {List}
      </div>
    )
  }
}
