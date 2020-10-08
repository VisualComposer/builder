import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import PropTypes from 'prop-types'
import { getResponse } from '../../../tools/response'
import { getService } from 'vc-cake'

const Utils = getService('utils')

export default class Dropdown extends Attribute {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    value: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.any,
    extraClass: PropTypes.any,
    description: PropTypes.string
  }

  static defaultProps = {
    fieldType: 'dropdown'
  }

  constructor (props) {
    super(props)

    this.state.dropdownOptions = this.getSelectOptions(props)

    this.handleUpdateList = this.handleUpdateList.bind(this)
  }

  componentDidMount () {
    let value = this.state.value
    if (!value && this.props.options && this.props.options.global) {
      value = this.state.dropdownOptions[0].value
      this.setFieldValue(value)
    }
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    super.UNSAFE_componentWillReceiveProps(nextProps)
    this.setState({ dropdownOptions: this.getSelectOptions(nextProps)})
  }
  /* eslint-enable */

  createGroup (key, groupObject, fieldKey) {
    const optionElements = []
    const { values, label } = groupObject
    const labelValue = label.replace(/\s+/g, '')
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        optionElements.push(this.createOptions(key, values, fieldKey))
      }
    }
    if (!optionElements.length) {
      return null
    }
    return <optgroup key={fieldKey + ':' + key + ':' + labelValue} label={label}>{optionElements}</optgroup>
  }

  createOptions (key, values, fieldKey) {
    const value = values[key].value
    const label = values[key].label
    const disabled = values[key].disabled
    const selected = values[key].selected
    return <option key={fieldKey + ':' + key + ':' + value} value={value} disabled={disabled} selected={selected}>{label}</option>
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

  generateSelectChildren (props) {
    const optionElements = []
    const values = this.state.dropdownOptions
    const { fieldKey } = props

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        if (Object.prototype.hasOwnProperty.call(values[key], 'group')) {
          const group = this.createGroup(key, values[key].group, fieldKey)
          if (group) {
            optionElements.push(group)
          }
        } else {
          optionElements.push(this.createOptions(key, values, fieldKey))
        }
      }
    }

    return optionElements
  }

  handleUpdateList () {
    this.props.setLoadingState(true)

    const ajax = Utils.ajax
    if (this.serverRequest) {
      this.serverRequest.abort()
    }

    this.serverRequest = ajax({
      'vcv-action': `dropdown:${this.props.options.reloadAction}:updateList:adminNonce`,
      'vcv-nonce': window.vcvNonce
    }, (request) => {
      const response = getResponse(request.response)
      this.props.setLoadingState(false)
      if (response && response.status) {
        const { global } = this.props.options || {}
        if (typeof window[global] === 'function') {
          window[global] = () => {
            return response.data
          }
        } else {
          window[global] = response.data
        }
        this.setState({ dropdownOptions: response.data })
        if (this.state.value === '' && response.data && response.data.length && response.data[0].value) {
          this.setFieldValue(response.data[0].value)
        }
      }
    })
  }

  render () {
    const { value } = this.state
    const selectClass = classNames({
      'vcv-ui-form-dropdown': true
    }, this.props.extraClass)
    let description = ''
    if (this.props.description) {
      description = (<p className='vcv-ui-form-helper'>{this.props.description}</p>)
    }

    const customProps = {}
    if (this.props.options && this.props.options.reloadAction) {
      customProps.onClick = this.handleUpdateList
    }

    return (
      <>
        <select
          value={value}
          onChange={this.handleChange}
          className={selectClass}
          {...customProps}
        >
          {this.generateSelectChildren(this.props)}
        </select>
        {description}
      </>
    )
  }
}
