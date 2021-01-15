import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicField/dynamicAttribute'

export default class StringAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'string'
  }

  constructor (props) {
    super(props)
    this.input = React.createRef()
  }

  render () {
    const { value } = this.state
    let { placeholder, options } = this.props
    if (!placeholder && this.props.options && this.props.options.placeholder) {
      placeholder = this.props.options.placeholder
    }
    const inputType = options && options.inputType ? options.inputType : 'text'

    const fieldClassNames = classNames({
      'vcv-ui-form-input': true,
      'vcv-ui-form-field-dynamic': options && options.dynamicField,
      'vcv-ui-form-input--error': options && options.inputType && this.input.current && !this.input.current.checkValidity()
    })
    const fieldComponent = (
      <input
        className={fieldClassNames}
        type={inputType}
        onChange={this.handleChange}
        placeholder={placeholder}
        value={value}
        ref={this.input}
      />
    )

    return (
      <DynamicAttribute {...this.props} setFieldValue={this.setFieldValue} value={value}>
        {fieldComponent}
      </DynamicAttribute>
    )
  }
}
