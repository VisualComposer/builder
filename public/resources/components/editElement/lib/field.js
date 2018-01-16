import React from 'react'
import {format} from 'util'
import {getStorage, getService, env} from 'vc-cake'
import PropTypes from 'prop-types'

const elementsStorage = getStorage('elements')
let elementAccessPoint = null

if (env('REFACTOR_ELEMENT_ACCESS_POINT')) {
  elementAccessPoint = getService('elementAccessPoint')
}

export default class Field extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.updateElementOnExternalChange = this.updateElementOnExternalChange.bind(this)
    this.state = {
      element: props.element
    }
    if (env('REFACTOR_ELEMENT_ACCESS_POINT')) {
      this.element = elementAccessPoint.get(props.element.get('id'))
    }
  }

  componentDidMount () {
    const { element, fieldKey } = this.props
    if (env('REFACTOR_ELEMENT_ACCESS_POINT')) {
      this.element.onAttributeChange(fieldKey, this.updateElementOnExternalChange)
    } else {
      elementsStorage.state(`element:${element.get('id')}:attribute:${fieldKey}`)
        .onChange(this.updateElementOnExternalChange)
    }
  }

  componentWillUnmount () {
    const { element, fieldKey } = this.props
    const id = element.get('id')
    if (env('REFACTOR_ELEMENT_ACCESS_POINT')) {
      this.element.ignoreAttributeChange(fieldKey, this.updateElementOnExternalChange)
    } else {
      elementsStorage.state(`element:${id}:attribute:${fieldKey}`)
        .ignoreChange(this.updateElementOnExternalChange)
      elementsStorage.state(`element:${id}:attribute:${fieldKey}`).delete()
    }
  }

  updateElementOnExternalChange (value) {
    const { element } = this.state
    const { fieldKey } = this.props
    element.set(fieldKey, value)
    this.setState({ element: element })
  }

  updateElement (fieldKey, value) {
    this.element[ fieldKey ] = value
  }

  render () {
    let { fieldKey, updater, tab } = this.props
    if (env('REFACTOR_ELEMENT_ACCESS_POINT')) {
      updater = this.updateElement.bind(this)
    }
    const { element } = this.state
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
          fieldKey={fieldKey}
          updater={updater}
          element={element}
          ref='domComponent'
        />
        {description}
      </div>
    )
  }
}
