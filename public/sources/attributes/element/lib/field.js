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
      hasInnerFields: false,
      isFieldLoading: false
    }
    this.setInnerFieldStatus = this.setInnerFieldStatus.bind(this)
    this.setLoadingState = this.setLoadingState.bind(this)
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

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.props.setFieldMount(nextProps.fieldKey, {
      refWrapper: this.refs.fieldAttributeWrapper,
      refWrapperComponent: this,
      refAttributeComponent: this.refs.attributeComponent
    }, 'field')
  }
  /* eslint-enable */

  setInnerFieldStatus () {
    // If field has other fields inside add class to remove margin from parent field
    this.setState({
      hasInnerFields: true
    })
  }

  setLoadingState (isLoading) {
    this.setState({ isFieldLoading: isLoading })
  }

  render () {
    const { elementAccessPoint, fieldKey } = this.props
    const cookElement = elementAccessPoint.cook()
    const element = cookElement.toJS()
    const { type, settings } = cookElement.settings(fieldKey)
    const AttributeComponent = type.component
    if (!AttributeComponent) {
      return null
    }
    if (!settings) {
      throw new Error(format('Wrong attribute settings %s', fieldKey))
    }
    if (!type) {
      throw new Error(format('Wrong attribute type %s', fieldKey))
    }

    const classes = classNames({
      'vcv-ui-form-dependency': true
    }, this.state.dependenciesClasses)
    const groupClasses = classNames({
      'vcv-ui-form-group': true,
      'vcv-ui-form-group--has-inner-fields': this.state.hasInnerFields
    })
    let value = null
    if (fieldKey && element) {
      value = element[fieldKey]
    }
    const { options } = settings
    let label = ''
    if (options && typeof options.label === 'string') {
      let spinnerHtml = null
      if (this.state.isFieldLoading) {
        spinnerHtml = (
          <span className='vcv-ui-wp-spinner' />
        )
      }
      label = (<span className='vcv-ui-form-group-heading'>{options.label}{spinnerHtml}</span>)
    }
    let description = ''
    if (options && typeof options.description === 'string') {
      description = (<p className='vcv-ui-form-helper'>{options.description}</p>)
    }
    if (options && options.descriptionHTML) {
      const html = options.descriptionHTML.replace('{vcvCreateMenuUrl}', window.vcvCreateMenuUrl)
      description = (<p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: html }} />)
    }
    let defaultValue = settings.defaultValue
    if (typeof defaultValue === 'undefined') {
      defaultValue = settings.value
    }

    return (
      <div ref='fieldAttributeWrapper' className={classes}>
        <div className={groupClasses} key={`element-form-group-field-${cookElement.get('id')}-${fieldKey}`}>
          {label}
          <AttributeComponent
            {...this.props}
            key={'inner-attribute-' + fieldKey + cookElement.get('id')}
            options={options}
            value={value}
            fieldKey={fieldKey}
            defaultValue={defaultValue}
            updater={this.props.updater}
            elementAccessPoint={elementAccessPoint}
            ref='attributeComponent'
            setLoadingState={this.setLoadingState}
          />
          {description}
        </div>
      </div>
    )
  }
}
