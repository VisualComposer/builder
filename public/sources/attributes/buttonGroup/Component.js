import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'

export default class ButtonGroup extends Attribute {
  static defaultProps = {
    fieldType: 'buttonGroup'
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  /**
   * Handle click on a group button
   * @param e
   */
  handleClick (e) {
    const value = e && e.currentTarget.dataset.value
    this.setFieldValue(value)
  }

  /**
   * Get icon element and assign class from settings value
   * @param value
   * @return element
   */
  getIcon (value) {
    let iconClasses = ['vcv-ui-icon-attribute']
    iconClasses.push(value.icon)
    iconClasses = classNames(iconClasses)
    return <i className={iconClasses} />
  }

  /**
   * Get each button element from the group,
   * with corresponding content form settings (icon or text)
   * @return array
   */
  getItems () {
    const values = this.getValues()
    return values.map((value, i) => {
      const content = value.icon ? this.getIcon(value) : value.text
      let buttonClasses = ['vcv-ui-form-button']
      if (value.value === this.state.value) {
        buttonClasses.push('vcv-ui-form-button--active')
      }
      buttonClasses = classNames(buttonClasses)
      return (
        <span
          className={buttonClasses}
          title={value.label}
          data-value={value.value}
          onClick={this.handleClick}
          key={`vcv-ui-button-group-attribute-${this.props.fieldKey}-${i}`}
        >
          {content}
        </span>
      )
    })
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

  render () {
    return (
      <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--attribute'>
        {this.getItems()}
      </div>
    )
  }
}
