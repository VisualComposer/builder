import React from 'react'
import lodash from 'lodash'
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
    this.props.element.onAttributeChange(this.props.fieldKey, this.updateValue)
  }

  updateValue (data) {
    if (!lodash.isEqual(data, this.state.value)) {
      this.setState({
        value: data
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
      throw new Error(`Wrong attribute settings ${fieldKey}`)
    }
    if (!type) {
      throw new Error(`Wrong attribute type ${fieldKey}`)
    }
    const { options } = settings
    const tabTypeName = tab.data.type.name
    let label = ''
    const isOptionsLabel = options && typeof options.label === 'string'
    const isRegularAttributeField = tabTypeName === 'group' && fieldType !== 'paramsGroup'
    const isParamsGroupAttributeField = tabTypeName === 'paramsGroup'
    if (isOptionsLabel && (isRegularAttributeField || isParamsGroupAttributeField)) {
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
