import React from 'react'
import classNames from 'classnames'
import Autocomplete from './../autocomplete/Component'
import Dropdown from './../dropdown/Component'
import Toggle from './../toggle/Component'
import { getService, getStorage } from 'vc-cake'

import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Tooltip from 'public/components/tooltip/tooltip'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')

export default class DynamicPopupContent extends React.Component {
  static localizations = dataManager.get('localizations')

  static propTypes = {
    fieldType: PropTypes.string.isRequired,
    value: PropTypes.string,
    elementAccessPoint: PropTypes.object,
    renderExtraOptions: PropTypes.func,
    handleCurrentPostFieldChange: PropTypes.func.isRequired,
    handleSourceIdChange: PropTypes.func.isRequired,
    handleShowAutocompleteChange: PropTypes.func.isRequired,
    sourceId: PropTypes.number.isRequired,
    currentPostField: PropTypes.string,
    showAutocomplete: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)

    this.sourceIdChange = this.sourceIdChange.bind(this)
    this.dynamicFieldChange = this.dynamicFieldChange.bind(this)
    this.autocompleteToggleChange = this.autocompleteToggleChange.bind(this)
    this.onLoadPostFields = this.onLoadPostFields.bind(this)

    this.dropdownRef = React.createRef()

    this.state = {
      postFields: {},
      dataLoaded: false
    }

    window.setTimeout(() => {
      settingsStorage.trigger('loadDynamicPost', props.sourceId, this.onLoadPostFields, (error) => {
        console.warn('Error loading dynamic post info', error)
        this.onLoadPostFields(props.sourceId, {}, {})
      }, props.showAutocomplete)
    }, 1)
  }

  onLoadPostFields (sourceId, postData, postFields) {
    if (this.props.sourceId === sourceId) {
      this.setState({
        dataLoaded: true,
        postFields: postFields || {}
      }, () => {
        // Update attribute value with new sourceId
        const dropdownRealValue = ReactDOM.findDOMNode(this.dropdownRef.current).value
        if (this.props.currentPostField !== dropdownRealValue) {
          this.dynamicFieldChange(undefined, dropdownRealValue)
        }
      })
    }
  }

  sourceIdChange (_, value) {
    if (value && value.trim().match(/^\d+$/)) {
      // Value is number, so we can try to set it
      const sourceId = parseInt(value, 10)
      const state = {}
      state.dataLoaded = false
      state.postFields = {}

      window.setTimeout(() => {
        settingsStorage.trigger('loadDynamicPost', sourceId, this.onLoadPostFields, (error) => {
          console.warn('Error loading dynamic post info', error)
          this.onLoadPostFields(this.props.sourceId, {}, {})
        }, this.props.showAutocomplete)
      }, 1)
      this.props.handleSourceIdChange(sourceId)
      this.setState(state)
    } else {
      // We have wrong post at all :/
      this.setState({
        postFields: {},
        dataLoaded: true
      })
    }
  }

  dynamicFieldChange (_, dynamicFieldKey) {
    this.props.handleCurrentPostFieldChange(dynamicFieldKey)
  }

  renderAutoCompleteInput () {
    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-dynamic-field-autocomplete-container'>
          <div className='vcv-ui-form-group-heading-wrapper'>
            <span className='vcv-ui-form-group-heading'>Source</span>
            <Tooltip
              relativeElementSelector='.vcv-ui-modal-content'
            >
              {DynamicPopupContent.localizations.dynamicAutocompleteDescription || 'Select a page, post, or custom post type as the dynamic content source.'}
            </Tooltip>
          </div>
          <Autocomplete
            value={this.props.sourceId + ''} // force string
            elementAccessPoint={this.props.elementAccessPoint}
            fieldKey={`${this.props.fieldKey}-dynamic-source-autocomplete`}
            key={`${this.props.fieldKey}-dynamic-source-autocomplete-${this.props.sourceId + ''}`}
            options={{
              single: true,
              action: 'dynamicPosts',
              labelAction: '',
              validation: true
            }}
            updater={this.sourceIdChange}
          />
        </div>
      </div>
    )
  }

  renderAutocompleteToggle () {
    return (
      <>
        <Toggle
          value={this.props.showAutocomplete}
          elementAccessPoint={this.props.elementAccessPoint}
          fieldKey={`${this.props.fieldKey}-dynamic-source-autocomplete`}
          key={`${this.props.fieldKey}-dynamic-source-autocomplete-toggle-${this.props.sourceId + ''}`}
          options={{ labelText: DynamicPopupContent.localizations.dynamicAutocompleteToggleLabel || 'Set custom post source' }}
          updater={this.autocompleteToggleChange}
        />
        <Tooltip
          relativeElementSelector='.vcv-ui-modal-content'
        >
          {DynamicPopupContent.localizations.dynamicAutocompleteToggleDescription || 'By default, dynamic content is taken from the current post.'}
        </Tooltip>
      </>
    )
  }

  renderDynamicFieldsDropdown (fieldsList) {
    const dropdownLabel = DynamicPopupContent.localizations.dynamicSelectCustomField || 'Select a custom field'
    const newFieldsList = Object.values(fieldsList)
    newFieldsList.unshift({ label: dropdownLabel, value: '', disabled: true })

    let currentValue = ''
    if (this.props.onlyDynamicCustomFields && this.props.currentPostField === 'Select Custom Field') {
      currentValue = 'customMetaField::'
    } else {
      currentValue = this.props.currentPostField ? this.props.currentPostField.replace(/^(.+)(::)(.+)$/, '$1$2') : ''
    }

    return (
      <Dropdown
        value={currentValue}
        fieldKey={`${this.props.fieldKey}-dynamic-dropdown`}
        options={{
          values: newFieldsList
        }}
        updater={this.dynamicFieldChange}
        ref={this.dropdownRef}
      />
    )
  }

  autocompleteToggleChange (_, value) {
    if (!value && (this.props.sourceId !== dataManager.get('sourceID'))) {
      // Return back current source ID
      this.sourceIdChange(_, dataManager.get('sourceID') + '') // force string + change id
    }

    this.props.handleShowAutocompleteChange(value, () => {
      this.sourceIdChange(_, this.props.sourceId + '') // Re-trigger change to explicitly save the ID
    })
  }

  renderDynamicFieldsExtra () {
    let extraDynamicComponent = null
    if (this.props.currentPostField && this.props.currentPostField.match(/::/)) {
      const [dynamicFieldKey, extraKey] = this.props.currentPostField.split('::')
      const updateExtraKey = (e) => {
        e && e.preventDefault()
        const extraDynamicFieldKey = e.currentTarget && e.currentTarget.value
        const dynamicFieldKeyFull = `${dynamicFieldKey}::${extraDynamicFieldKey}`
        this.dynamicFieldChange(null, dynamicFieldKeyFull)
      }
      const extraDynamicFieldClassNames = classNames({
        'vcv-ui-form-input': true,
        'vcv-ui-form-field-dynamic-extra': true
      })
      extraDynamicComponent =
        <input type='text' className={extraDynamicFieldClassNames} onChange={updateExtraKey} value={extraKey} placeholder='Enter valid meta key' />
    }

    return extraDynamicComponent
  }

  render () {
    const autoCompleteComponent = this.props.showAutocomplete ? this.renderAutoCompleteInput() : null
    let loader = null
    let fieldComponent = null
    let extraDynamicComponent = null

    if (!this.state.dataLoaded) {
      loader = <span className='vcv-ui-icon vcv-ui-wp-spinner' />
    } else {
      const postFields = this.state.postFields
      const fieldsList = postFields[this.props.fieldType] || {}
      fieldComponent = this.renderDynamicFieldsDropdown(fieldsList)
      extraDynamicComponent = this.renderDynamicFieldsExtra()
    }

    return (
      <div className='vcv-ui-dynamic-field-inner'>
        <div className='vcv-ui-form-group'>
          {fieldComponent}
          {extraDynamicComponent}
          {loader}
        </div>
        <div className='vcv-ui-form-group'>
          {this.props.onlyDynamicCustomFields ? null : this.renderAutocompleteToggle()}
        </div>
        {autoCompleteComponent}
        {this.props.renderExtraOptions && this.props.renderExtraOptions()}
      </div>
    )
  }
}
