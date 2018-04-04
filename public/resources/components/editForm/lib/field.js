import React from 'react'
import { format } from 'util'
import PropTypes from 'prop-types'

export default class Field extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    onAttributeChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      value: props.element[ props.fieldKey ]
    }
    this.updateElement = this.updateElement.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }

  componentDidMount () {
    // TODO find issue why attribute onChange doesn't trigger ?
    this.props.element.onAttributeChange(this.props.fieldKey, this.updateValue)
    // this.props.element.onChange(this.updateValue)
  }

  updateValue (data) {
    // TODO find issue why attribute onChange doesn't trigger ?
    if (data[ this.props.fieldKey ] && this.state.value !== data[ this.props.fieldKey ]) {
      this.setState({
        value: data[ this.props.fieldKey ]
      })
    }
  }

  updateElement (fieldKey, value) {
    this.props.element[ fieldKey ] = value
    this.props.onAttributeChange(fieldKey)
  }

  render () {
    let { fieldKey, tab, fieldType, element } = this.props
    let { value } = this.state
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
          value={value}
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
