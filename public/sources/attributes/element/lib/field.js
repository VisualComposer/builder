import React from 'react'
import { format } from 'util'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class EditFromField extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired,
    setFieldMount: PropTypes.func.isRequired,
    setFieldUnmount: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      dependenciesClasses: [],
      hasInnerFields: false
    }
    this.setInnerFieldStatus = this.setInnerFieldStatus.bind(this)
  }

  componentDidMount () {
    this.props.setFieldMount(this.props.fieldKey, {
      refWrapper: this.refs.fieldAttributeWrapper,
      refWrapperComponent: this,
      refAttributeComponent: this.refs.attributeComponent
    }, 'field')
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.fieldKey, 'field')
  }

  componentWillReceiveProps (nextProps) {
    this.props.setFieldMount(nextProps.fieldKey, {
      refWrapper: this.refs.fieldAttributeWrapper,
      refWrapperComponent: this,
      refAttributeComponent: this.refs.attributeComponent
    }, 'field')
  }

  setInnerFieldStatus () {
    // If field has other fields inside add class to remove margin from parent field
    this.setState({
      hasInnerFields: true
    })
  }

  render () {
    let { elementAccessPoint, fieldKey } = this.props
    let cookElement = elementAccessPoint.cook()
    let element = cookElement.toJS()
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

    let classes = classNames({
      'vcv-ui-form-dependency': true
    }, this.state.dependenciesClasses)
    let groupClasses = classNames({
      'vcv-ui-form-group': true,
      'vcv-ui-form-group--has-inner-fields': this.state.hasInnerFields
    })
    let value
    if (fieldKey && element) {
      value = element[ fieldKey ]
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
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === `undefined`) {
      defaultValue = settings.value
    }

    return (
      <div ref='fieldAttributeWrapper' className={classes}>
        <div className={groupClasses} key={`element-form-group-field-${cookElement.get('id')}-${fieldKey}`}>
          {label}
          <AttributeComponent
            {...this.props}
            key={'attribute-' + fieldKey + cookElement.get('id')}
            options={options}
            value={value}
            fieldKey={fieldKey}
            defaultValue={defaultValue}
            updater={this.props.updater}
            elementAccessPoint={elementAccessPoint}
            ref='attributeComponent'
          />
          {description}
        </div>
      </div>
    )
  }
}
