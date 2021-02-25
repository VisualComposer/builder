import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import options from './options'
import DynamicAttribute from '../dynamicField/dynamicAttribute'

export default class InputSelect extends Attribute {
  static defaultProps = {
    fieldType: 'inputSelect'
  }

  list = null

  constructor (props) {
    super(props)
    this.state = this.updateState(this.props)

    this.handleClick = this.handleClick.bind(this)
    this.handleSelectToggle = this.handleSelectToggle.bind(this)
    this.setFieldValue = this.setFieldValue.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.dynamicAttributeChange = this.dynamicAttributeChange.bind(this)
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
      this.handleSelectToggle()
    }
  }

  handleSelectToggle (e) {
    if (this.state.openedSelect) {
      document.body.removeEventListener('click', this.handleClick)
    } else {
      document.body.addEventListener('click', this.handleClick)
    }
    if (e && e.target) {
      this.setState({
        openedSelect: !this.state.openedSelect
      })
    }
  }

  createGroup (key, groupObject, fieldKey) {
    const optionElements = []
    const { values, label } = groupObject
    const labelValue = label.replace(/\s+/g, '')
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }
    return <optgroup key={fieldKey + ':' + key + ':' + labelValue} label={label}>{optionElements}</optgroup>
  }

  createOptions (key, values, fieldKey, type) {
    const value = values[key].value
    const label = values[key].label
    if (type === 'large') {
      const displayValue = value.replace('_', '')
      let itemClasses = 'vcv-ui-form-input-select-item'
      const activeValue = (this.state && this.state.select) || this.props.value.select
      if (activeValue === value) {
        itemClasses += ' vcv-ui-form-input-select-item-active'
      }
      return (
        <div
          key={fieldKey + ':' + key + ':' + value}
          onClick={this.hangleLargeListClick.bind(this, value)}
          className={itemClasses}
        >
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
    const { global } = props.options || {}
    if (global && (!values || !values.length)) {
      if (typeof window[global] === 'function') {
        values = window[global]()
      } else {
        values = window[global] || []
      }
    }

    return values
  }

  getDefaultOptions (props) {
    if (!props) {
      props = this.props
    }
    const { type } = props.options || ''
    if (type && options[type]) {
      return options[type]
    }
    return []
  }

  generateSelectChildren (props) {
    const optionElements = []
    const defaultValues = this.getDefaultOptions(props)
    const values = [...defaultValues, ...this.getSelectOptions(props)]
    const { fieldKey } = props
    const type = props.options && (props.options.type === 'currency' || props.options.large) ? 'large' : 'small'

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        if (Object.prototype.hasOwnProperty.call(values[key], 'group') && type === 'small') {
          optionElements.push(this.createGroup(key, values[key].group, fieldKey))
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

  dynamicAttributeChange (value) {
    this.setFieldValue('input', value)
  }

  hangleLargeListClick (value) {
    this.handleSelectToggle()
    this.setFieldValue('select', value)
  }

  setFieldValue (key, value) {
    const { updater, fieldKey } = this.props
    const { input, select } = this.state
    const updatedValues = {
      input,
      select,
      [key]: value
    }

    updater(fieldKey, updatedValues)
    this.setState({
      [key]: value,
      openedSelect: false
    })
  }

  getSelect (props) {
    if (!props) {
      props = this.props
    }
    if (props.options && (props.options.type === 'currency' || props.options.large)) {
      const displayValue = this.state.select.replace('_', '')
      let classNames = 'vcv-ui-form-dropdown vcv-ui-form-input-select'
      if (this.state.openedSelect) {
        classNames += ' vcv-ui-form-state--focus'
      }
      return (
        <div
          className={classNames}
          onClick={this.handleSelectToggle}
        >
          {displayValue}
        </div>
      )
    } else {
      const selectChildren = this.generateSelectChildren(props)
      return (
        <select
          value={this.state.select}
          onChange={this.handleDropdownChange}
          className='vcv-ui-form-dropdown'
        >
          {selectChildren}
        </select>
      )
    }
  }

  getList () {
    if (this.state.openedSelect) {
      const selectChildren = this.generateSelectChildren(this.props)
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
    const { input } = this.state
    let { placeholder } = this.props
    if (!placeholder && this.props.options && this.props.options.placeholder) {
      placeholder = this.props.options.placeholder
    }

    const Select = this.getSelect(this.props)
    const List = this.getList()
    const fieldClassNames = classNames({
      'vcv-ui-form-input-select': true,
      'vcv-ui-form-field-dynamic': this.props.options && this.props.options.dynamicField
    })

    const fieldComponent = (
      <div className={fieldClassNames}>
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

    return (
      <DynamicAttribute
        {...this.props}
        setFieldValue={this.dynamicAttributeChange}
        value={input}
      >
        {fieldComponent}
      </DynamicAttribute>
    )
  }
}
