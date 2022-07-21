import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import Scrollbar from '../../../components/scrollbar/scrollbar'
import { getResponse } from '../../../tools/response'
import { getService } from 'vc-cake'

const dataProcessor = getService('dataProcessor')

export default class Checkbox extends Attribute {
  static defaultProps = {
    fieldType: 'checkbox'
  }

  scrollbar = null

  spinnerHtml = (
    <span className='vcv-ui-wp-spinner' />
  )

  constructor (props) {
    super(props)
    this.ref = React.createRef()
    this.handleScroll = this.handleScroll.bind(this)
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
    this.requestToServer = this.requestToServer.bind(this)
    this.state.loading = props?.options?.action
  }

  updateState (props) {
    return {
      value: props.value,
      values: this?.props?.options?.values || this.getValues()
    }
  }

  getValues () {
    const { props } = this
    let { values } = props.options || []
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

  componentDidMount () {
    if (this.props?.options?.action) {
      // Initial Request to server
      this.requestToServer()
    }
    if (this.props.options && this.props.options.itemLimit) {
      const items = this.ref.current && this.ref.current.querySelectorAll('.vcv-ui-form-checkbox')
      if (items && items.length > this.props.options.itemLimit) {
        let heightLimit = 0
        items.forEach((item, i) => {
          if (i < this.props.options.itemLimit) {
            const itemHeight = item.getBoundingClientRect().height || 20
            const itemMargins = parseInt(window.getComputedStyle(item).marginTop) + parseInt(window.getComputedStyle(item).marginBottom)
            heightLimit = heightLimit + itemHeight + itemMargins
          }
        })
        this.setState({ heightLimit: heightLimit })
      }
    }
  }

  requestToServer () {
    this.setState({
      loading: true
    })

    dataProcessor.appAdminServerRequest({
      'vcv-action': 'attribute:checkbox:render:adminNonce',
      'vcv-tag': this.props?.elementAccessPoint?.tag || '',
      'vcv-element': this.props.elementAccessPoint ? this.props.elementAccessPoint.cook().toJS() : {},
      'vcv-field-key': this.props.fieldKey,
      'vcv-field-value': this.state.value,
      'vcv-field-action': this.props.options.action
    }).then((requestData) => {
      const response = getResponse(requestData)
      const state = {
        loading: false
      }
      if (response.status && response.results) {
        state.values = response.results
      }
      this.setState(state)
    }, (error) => {
      console.warn('Failed to load checkboxes', error)
      this.setState({
        loading: false
      })
    })
  }

  scrollBarMounted (scrollbar) {
    this.scrollbar = scrollbar
  }

  handleChange (event) {
    const value = event.target.value
    const values = this.state.value
    if (event.target.checked) {
      values.push(value)
    } else {
      values.splice(values.indexOf(value), 1)
    }
    this.setFieldValue(values)
  }

  getCheckboxes (values, isChildren = false) {
    const { fieldKey } = this.props
    const currentValues = this.state.value
    const optionElements = []
    for (const key in values) {
      const value = values[key].value + ''
      const checked = currentValues && currentValues.indexOf(value) !== -1 ? 'checked' : ''
      const labelClasses = classNames({
        'vcv-ui-form-checkbox': true,
        'vcv-ui-form-checkbox--nested': isChildren
      })

      let toRender = false
      if (values[key].parent) {
        // Expicit nested conditional is necessary to handle different order of children in the array
        if (isChildren) {
          toRender = true
        }
      } else {
        toRender = true
      }

      if (toRender) {
        optionElements.push(
          <label key={fieldKey + ':' + key + ':' + value} className={labelClasses} htmlFor={fieldKey + '-' + key + '-' + value}>
            <input type='checkbox' onChange={this.handleChange} checked={checked} value={value} id={fieldKey + '-' + key + '-' + value} />
            <span className='vcv-ui-form-checkbox-indicator' />
            {values[key].label}
          </label>
        )
      }

      if (this.props.options.listView && this.props.options.nesting) {
        const initialValues = this.state.values
        const children = initialValues.filter(value => value.parent === values[key].id)
        if (children.length && toRender) {
          const childCheckboxes = this.getCheckboxes(children, true)
          optionElements.push(
            <div key={`${fieldKey}:${key}:children:${children.length}`} className='vcv-ui-form-checkbox-children'>{childCheckboxes}</div>)
        }
      }
    }
    return optionElements
  }

  handleScroll () {
    this.props.onScroll && this.props.onScroll(this.scrollbar.scrollbars)
  }

  render () {
    if (this.props?.options?.action && this.state.loading) {
      return this.spinnerHtml
    }

    const values = this.state.values
    const optionElements = this.getCheckboxes(values)

    let classNames = 'vcv-ui-form-checkboxes'
    if (this.props.options && this.props.options.listView) {
      classNames += ' vcv-ui-form-checkboxes--list'
    }
    if (this.props.options && this.props.options.itemLimit) {
      classNames += ' vcv-ui-form-checkboxes--limit'
    }

    let content = optionElements
    const styleProps = {}
    if (this.props.options.listView && this.state.heightLimit) {
      styleProps.height = `${this.state.heightLimit}px`
      content = (
        <Scrollbar ref={this.scrollBarMounted} onScroll={this.handleScroll}>{optionElements}</Scrollbar>
      )
    }

    return (
      <div className={classNames} ref={this.ref} style={{ ...styleProps }}>
        {content}
      </div>)
  }
}
