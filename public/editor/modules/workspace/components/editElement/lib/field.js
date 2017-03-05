import React from 'react'
import {format} from 'util'

export default class Field extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    updater: React.PropTypes.func.isRequired
  }

  render () {
    let { element, fieldKey } = this.props
    let { type, settings } = element.settings(fieldKey)
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
    let rawValue = type.getRawValue(element.data, fieldKey)
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === `undefined`) {
      defaultValue = settings.value
    }

    return (
      <div className='vcv-ui-form-group' key={`form-group-field-${element.get('id')}-${fieldKey}`}>
        {label}
        <AttributeComponent
          key={'attribute-' + fieldKey + element.get('id')}
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
