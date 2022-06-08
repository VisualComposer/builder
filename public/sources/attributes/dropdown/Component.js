import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import PropTypes from 'prop-types'
import { getResponse } from '../../../tools/response'
import { getService } from 'vc-cake'
import { isEqual, cloneDeep } from 'lodash'

const dataManager = getService('dataManager')
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
    description: PropTypes.string,
    noValueDescription: PropTypes.string,
    hasValueDescription: PropTypes.string,
    isFocused: PropTypes.bool
  }

  static defaultProps = {
    fieldType: 'dropdown'
  }

  constructor (props) {
    super(props)

    this.dropdownRef = null

    this.setDropdownRef = (element) => {
      this.dropdownRef = element
    }

    this.state.dropdownOptions = this.getSelectOptions(props)

    this.handleUpdateList = this.handleUpdateList.bind(this)
  }

  componentDidUpdate (prevProps) {
    super.componentDidUpdate(prevProps)
    if (!isEqual(prevProps, this.props)) {
      this.setState({ dropdownOptions: this.getSelectOptions(this.props) })
    }
    if (this.props.isFocused) {
      this.dropdownRef.focus()
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
    if (!optionElements.length) {
      return null
    }
    return <optgroup key={fieldKey + ':' + key + ':' + labelValue} label={label}>{optionElements}</optgroup>
  }

  createOptions (key, values, fieldKey) {
    const value = values[key].value || values[key].id
    const label = values[key].label || values[key].name
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

  getIndentation (level) {
    let indentaion = ''
    const nbsp = '\xa0'
    for (let i = 0; i <= level; i++) {
      indentaion += nbsp
    }
    return indentaion
  }

  /**
   * Creates and returns a new array with the items sorted by relation to parent.
   * @param options
   * @returns {[]}
   */
  getSortedOptions (options) {
    const topParents = options.filter(option => !option.parent)
    const children = options.filter(option => option.parent)
    const sortedOptions = []
    if (topParents.length && children.length) {
      const sort = (options, level = 0) => {
        options.forEach((option) => {
          let hasChildren = children.filter(child => child.parent === option.id)
          sortedOptions.push(option)
          if (hasChildren) {
            level = ++level
            const indentaion = this.getIndentation(level)
            hasChildren = hasChildren.map((child) => {
              child.label = `${indentaion}${child.label}`
              return child
            })
            sort(hasChildren, level)
          }
          level = 0
        })
      }
      sort(topParents)
    }
    return sortedOptions
  }

  generateSelectChildren (props) {
    const optionElements = []
    let values = this.state.dropdownOptions
    const { fieldKey } = props
    if (props.options && props.options.nesting) {
      // need a deep copy, to prevent changing initial array label values
      const optionsToSort = cloneDeep(values)
      const sortedOption = this.getSortedOptions(optionsToSort)
      values = sortedOption.length ? sortedOption : values
    }

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
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-source-id': dataManager.get('sourceID')
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

  replaceVariablesInText (text) {
    let newText = text
    const regex = /{([^}]*)}/g
    let curMatch = ''
    while ((curMatch = regex.exec(newText)) !== null) {
      const globalVariable = curMatch[1]
      if (window[globalVariable]) {
        newText = newText.replace(`{${globalVariable}}`, window[globalVariable])
      }
    }
    return newText
  }

  render () {
    const { value } = this.state
    const { options } = this.props
    const selectClass = classNames({
      'vcv-ui-form-dropdown': true
    }, this.props.extraClass)

    let valueDescription = ''
    if (this.state.value) {
      if (options && options.hasValueDescription) {
        let text = ''
        let editLink = window && window.vcvWpAdminUrl ? window.vcvWpAdminUrl : ''
        editLink += `post.php?post=${value}&action=edit`
        text = options.hasValueDescription.replace('{editLink}', editLink)
        text = this.replaceVariablesInText(text)
        valueDescription = (<p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: text }} />)
      }
    } else {
      if (options && options.noValueDescription) {
        let text = options.noValueDescription
        text = this.replaceVariablesInText(text)
        valueDescription = (<p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: text }} />)
      }
    }

    const customProps = {}
    if (options && options.reloadAction) {
      customProps.onClick = this.handleUpdateList
    }

    return (
      <>
        <select
          ref={this.setDropdownRef}
          value={value}
          onChange={this.handleChange}
          className={selectClass}
          {...customProps}
        >
          {this.generateSelectChildren(this.props)}
        </select>
        {valueDescription}
      </>
    )
  }
}
