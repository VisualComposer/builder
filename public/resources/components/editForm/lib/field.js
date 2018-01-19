import React from 'react'
import {format} from 'util'
import PropTypes from 'prop-types'

export default class Field extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.updateElement = this.updateElement.bind(this)
  }

  updateElement (fieldKey, value) {
    this.props.element[ fieldKey ] = value
  }

  render () {
    let { fieldKey, tab, fieldType, element } = this.props
    let { type, settings } = element.cook().settings(fieldKey)
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
    const tabTypeName = tab.data.type.name
    let label = ''
    if (options && typeof options.label === 'string' && tabTypeName === 'group') {
      label = (<span className='vcv-ui-form-group-heading'>{options.label}</span>)
    }
    let description = ''
    if (options && typeof options.description === 'string') {
      description = (<p className='vcv-ui-form-helper'>{options.description}</p>)
    }
    if (options && options.descriptionHTML) {
      description = (<p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: options.descriptionHTML }} />)
    }
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === `undefined`) {
      defaultValue = settings.value
    }
    return (
      <div className='vcv-ui-form-group' key={`form-group-field-${element.id}-${fieldKey}`}>
        {label}
        <AttributeComponent
          key={'attribute-' + fieldKey + element.id}
          options={options}
          value={element[ fieldKey ]}
          defaultValue={defaultValue}
          fieldKey={fieldKey}
          updater={this.updateElement}
          element={element.cook()}
          fieldType={fieldType}
          ref={ref => { this.domComponent = ref }}
        />
        {description}
      </div>
    )
  }
}
