import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import Scrollbar from '../../../components/scrollbar/scrollbar'

export default class Checkbox extends Attribute {
  static defaultProps = {
    fieldType: 'checkbox'
  }

  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount () {
    if (this.props.options && this.props.options.itemLimit) {
      const items = this.ref.current && this.ref.current.querySelectorAll('.vcv-ui-form-checkbox')
      if (items.length > this.props.options.itemLimit) {
        let heightLimit = 0
        items.forEach((item, i) => {
          if (i < this.props.options.itemLimit) {
            const itemHeight = item.getBoundingClientRect().height
            const itemMargins = parseInt(window.getComputedStyle(item).marginTop) + parseInt(window.getComputedStyle(item).marginBottom)
            heightLimit = heightLimit + itemHeight + itemMargins
          }
        })
        this.setState({ heightLimit: heightLimit })
      }
    }
  }

  handleChange (event) {
    const value = event.target.value
    var values = this.state.value
    if (event.target.checked) {
      values.push(value)
    } else {
      values.splice(values.indexOf(value), 1)
    }
    this.setFieldValue(values)
  }

  getValues () {
    const { props } = this
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

  getCheckboxes (values, isChildren = false) {
    const { fieldKey } = this.props
    const currentValues = this.state.value
    const optionElements = []
    for (const key in values) {
      const value = values[key].value
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
        const initialValues = this.getValues()
        const children = initialValues.filter(value => value.parent === values[key].id)
        if (children.length && toRender) {
          const childCheckboxes = this.getCheckboxes(children, true)
          optionElements.push(<div key={`${fieldKey}:${key}:children:${children.length}`} className='vcv-ui-form-checkbox-children'>{childCheckboxes}</div>)
        }
      }
    }
    return optionElements
  }

  render () {
    const values = this.getValues()
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
        <Scrollbar>{optionElements}</Scrollbar>
      )
    }

    return (
      <div className={classNames} ref={this.ref} style={{ ...styleProps }}>
        {content}
      </div>)
  }
}
