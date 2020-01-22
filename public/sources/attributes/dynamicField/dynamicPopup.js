import React from 'react'
import classNames from 'classnames'
import Autocomplete from './../autocomplete/Component'
import Dropdown from './../dropdown/Component'
import Toggle from './../toggle/Component'
import { getService, getStorage } from 'vc-cake'
import Modal from 'public/components/modal/modal'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const settingsStorage = getStorage('settings')
const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()

export default class DynamicPopup extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  static propTypes = {
    save: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    fieldType: PropTypes.string.isRequired,
    value: PropTypes.string,
    elementAccessPoint: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.handleChangeSourceId = this.handleChangeSourceId.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.handleAutocompleteToggle = this.handleAutocompleteToggle.bind(this)
    this.onLoadPostFields = this.onLoadPostFields.bind(this)
    this.cancel = this.cancel.bind(this)
    this.save = this.save.bind(this)

    this.dropdownRef = React.createRef()

    const state = {
      postFields: null,
      currentPostField: null,
      showAutocomplete: false,
      sourceId: null
    }

    const value = props.value
    const postData = settingsStorage.state('postData').get()
    let sourceId = postData.post_id
    if (value && typeof value === 'string' && value.match(blockRegexp)) {
      const blockInfo = parseDynamicBlock(value)
      if (blockInfo && blockInfo.blockAtts) {
        if (blockInfo.blockAtts.sourceId) {
          // If sourceId explicitly set, then we expect that custom toggle is ON
          state.showAutocomplete = true
        }
        sourceId = blockInfo.blockAtts.sourceId || window.vcvSourceID
        state.currentPostField = blockInfo.blockAtts.value
      }
    }
    state.sourceId = parseInt(sourceId, 10)
    state.dataLoaded = false
    state.postFields = {}

    this.state = state

    window.setTimeout(() => {
      settingsStorage.trigger('loadDynamicPost', this.state.sourceId, this.onLoadPostFields, (error) => {
        console.warn('Error loading dynamic post info', error)
        this.onLoadPostFields(this.state.sourceId, {}, {})
      }, state.showAutocomplete)
    }, 1)
  }

  onLoadPostFields (sourceId, postData, postFields) {
    if (this.state.sourceId === sourceId) {
      this.setState({
        dataLoaded: true,
        postFields: postFields || {}
      }, () => {
        // Update attribute value with new sourceId
        const dropdownRealValue = ReactDOM.findDOMNode(this.dropdownRef.current).value
        if (this.state.currentPostField !== dropdownRealValue) {
          this.handleDynamicFieldChange(undefined, dropdownRealValue)
        }
      })
    }
  }

  handleChangeSourceId (_, value) {
    if (value && value.trim().match(/^\d+$/)) {
      // Value is number, so we can try to set it
      const sourceId = parseInt(value, 10)
      const state = {}
      state.sourceId = sourceId
      state.dataLoaded = false
      state.postFields = {}

      window.setTimeout(() => {
        settingsStorage.trigger('loadDynamicPost', sourceId, this.onLoadPostFields, (error) => {
          console.warn('Error loading dynamic post info', error)
          this.onLoadPostFields(this.state.sourceId, {}, {})
        }, this.state.showAutocomplete)
      }, 1)
      this.setState(state)
    } else {
      // We have wrong post at all :/
      this.setState({ postFields: {} })
    }
  }

  handleDynamicFieldChange (_, dynamicFieldKey) {
    this.setState({ currentPostField: dynamicFieldKey })
  }

  renderAutoCompleteInput () {
    return <div className='vcv-ui-form-group'>
      <div className='vcv-ui-dynamic-field-autocomplete-container'>
        <Autocomplete
          value={this.state.sourceId + ''} // force string
          elementAccessPoint={this.props.elementAccessPoint}
          fieldKey={`${this.props.fieldKey}-dynamic-source-autocomplete`}
          key={`${this.props.fieldKey}-dynamic-source-autocomplete-${this.state.sourceId + ''}`}
          options={{
            single: true,
            action: 'dynamicPosts',
            labelAction: '',
            validation: true
          }}
          updater={this.handleChangeSourceId}
          description={DynamicPopup.localizations.dynamicAutocompleteDescription || 'Select page, post, or custom post type.'}
        />
      </div>
    </div>
  }

  renderAutocompleteToggle () {
    return <>
      <Toggle
        value={this.state.showAutocomplete}
        elementAccessPoint={this.props.elementAccessPoint}
        fieldKey={`${this.props.fieldKey}-dynamic-source-autocomplete`}
        key={`${this.props.fieldKey}-dynamic-source-autocomplete-toggle-${this.state.sourceId + ''}`}
        options={{ labelText: DynamicPopup.localizations.dynamicAutocompleteToggleLabel || 'Set custom post source' }}
        updater={this.handleAutocompleteToggle}
      />
      <p className='vcv-ui-form-helper'>{DynamicPopup.localizations.dynamicAutocompleteToggleDescription || 'By default, dynamic content is taken from the current post.'}</p>
           </>
  }

  renderDynamicFieldsDropdown (fieldsList) {
    const dropdownLabel = DynamicPopup.localizations.dynamicSelectCustomField || 'Select custom field'
    const newFieldsList = Object.values(fieldsList)
    newFieldsList.unshift({ label: dropdownLabel, value: '', disabled: true })
    return (
      <Dropdown
        value={this.state.currentPostField ? this.state.currentPostField.replace(/^(.+)(::)(.+)$/, '$1$2') : ''}
        fieldKey={`${this.props.fieldKey}-dynamic-dropdown`}
        options={{
          values: newFieldsList
        }}
        updater={this.handleDynamicFieldChange}
        ref={this.dropdownRef}
      />
    )
  }

  handleAutocompleteToggle (_, value) {
    if (!value && (this.state.sourceId !== window.vcvSourceID)) {
      // Return back current source ID
      this.handleChangeSourceId(_, window.vcvSourceID + '') // force string + change id
    }
    this.setState({
      showAutocomplete: value
    }, () => {
      this.handleChangeSourceId(_, this.state.sourceId + '') // Re-trigger change to explicitly save the ID
    })
  }

  renderDynamicFieldsExtra () {
    let extraDynamicComponent = null
    if (this.state.currentPostField && this.state.currentPostField.match(/::/)) {
      const [dynamicFieldKey, extraKey] = this.state.currentPostField.split('::')
      const updateExtraKey = (e) => {
        e && e.preventDefault()
        const extraDynamicFieldKey = e.currentTarget && e.currentTarget.value
        const dynamicFieldKeyFull = `${dynamicFieldKey}::${extraDynamicFieldKey}`
        this.handleDynamicFieldChange(null, dynamicFieldKeyFull)
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

  cancel () {
    this.props.hide()
  }

  save () {
    if (!this.props.dynamicFieldOpened && this.state.currentPostField) {
      this.props.open()
    }

    if (this.state.currentPostField) {
      this.props.save(this.state.currentPostField, this.state.sourceId, this.state.showAutocomplete)
    }
    this.props.hide()
  }

  render () {
    const popupTitle = DynamicPopup.localizations.dynamicContent || 'Dynamic Content'
    const saveText = DynamicPopup.localizations.save || 'Save'
    const closeText = DynamicPopup.localizations.close || 'Close'
    const autoCompleteComponent = this.state.showAutocomplete ? this.renderAutoCompleteInput() : null
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
    const showModal = true

    return <Modal
      show={showModal}
      onClose={this.cancel}
    >

      <div className='vcv-ui-modal'>
        <header className='vcv-ui-modal-header'>
          <span className='vcv-ui-modal-close' onClick={this.cancel} title={closeText}>
            <i className='vcv-ui-modal-close-icon vcv-ui-icon vcv-ui-icon-close' />
          </span>
          <h1 className='vcv-ui-modal-header-title'>{popupTitle}</h1>
        </header>
        <section className='vcv-ui-modal-content'>
          <div className='vcv-ui-dynamic-field-inner'>
            <div className='vcv-ui-form-group'>
              {fieldComponent}
              {extraDynamicComponent}
              {loader}
            </div>
            <div className='vcv-ui-form-group'>
              {this.renderAutocompleteToggle()}
            </div>
            {autoCompleteComponent}
            {this.props.renderExtraOptions && this.props.renderExtraOptions()}
          </div>
        </section>
        <footer className='vcv-ui-modal-footer'>
          <div className='vcv-ui-modal-actions'>
            <span className='vcv-ui-modal-action' title={saveText} onClick={this.save}>
              <span className='vcv-ui-modal-action-content'>
                <i className='vcv-ui-modal-action-icon vcv-ui-icon vcv-ui-icon-save' />
                <span>{saveText}</span>
              </span>
            </span>
          </div>
        </footer>
      </div>
    </Modal>
  }
}
