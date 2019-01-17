import React from 'react'
import { format } from 'util'
import PropTypes from 'prop-types'

export default class EditFromField extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired
  }

  render () {
    let { elementAccessPoint, fieldKey } = this.props
    let cookElement = elementAccessPoint.cook()
    let { type, settings } = cookElement.settings(fieldKey)
    let AttributeComponent = type.component
    if (!AttributeComponent) {
      return null
    }
    if (!settings) {
      throw new Error(format('Wrong attribute settings %s', fieldKey))
    }
    if (!type) {
      throw new Error(format('Wrong attribute type %s', fieldKey))
    }
    const { options } = settings
    let label = ''
    if (options && typeof options.label === 'string') {
      label = (<span className='vcv-ui-form-group-heading'>{options.label}</span>)
    }
    let description = ''
    if (options && typeof options.description === 'string') {
      description = (<p className='vcv-ui-form-helper'>{options.description}</p>)
    }
    let rawValue = type.getRawValue(cookElement.data, fieldKey)
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === `undefined`) {
      defaultValue = settings.value
    }

    return (
      <div className='vcv-ui-form-group' key={`form-group-field-${cookElement.get('id')}-${fieldKey}`}>
        {label}
        <AttributeComponent
          key={'attribute-' + fieldKey + cookElement.get('id')}
          options={options}
          value={rawValue}
          defaultValue={defaultValue}
          {...this.props}
          ref='domComponent'
        />
        {description}
      </div>
    )
  }
}
