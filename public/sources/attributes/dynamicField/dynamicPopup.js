import React from 'react'
import { getService, getStorage } from 'vc-cake'
import Modal from 'public/components/modal/modal'
import PropTypes from 'prop-types'
import DynamicPopupContent from './dynamicPopupContent'
import Tooltip from 'public/components/tooltip/tooltip'

const dataManager = getService('dataManager')
const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()
const settingsStorage = getStorage('settings')

export default class DynamicPopup extends React.Component {
  static localizations = dataManager.get('localizations')

  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    fieldType: PropTypes.string.isRequired,
    value: PropTypes.string,
    elementAccessPoint: PropTypes.object
  }

  constructor (props) {
    super(props)

    const state = {
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
        sourceId = blockInfo.blockAtts.sourceId || dataManager.get('sourceID')
        state.currentPostField = blockInfo.blockAtts.value
      }
    }
    state.sourceId = parseInt(sourceId, 10)

    this.state = state

    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.onCurrentPostFieldChange = this.onCurrentPostFieldChange.bind(this)
    this.onSourceIdChange = this.onSourceIdChange.bind(this)
    this.onShowAutocompleteChange = this.onShowAutocompleteChange.bind(this)
  }

  onCurrentPostFieldChange (currentPostField) {
    this.setState({ currentPostField: currentPostField })
  }

  onSourceIdChange (sourceId) {
    this.setState({ sourceId: sourceId })
  }

  onShowAutocompleteChange (showAutocomplete, callback) {
    this.setState({ showAutocomplete: showAutocomplete }, () => {
      if (callback) {
        callback()
      }
    })
  }

  handleCloseClick () {
    this.props.onHide()
  }

  handleSaveClick () {
    if (!this.props.dynamicFieldOpened && this.state.currentPostField) {
      this.props.onOpen()
    }

    if (this.state.currentPostField) {
      this.props.onSave(this.state.currentPostField, this.state.sourceId, this.state.showAutocomplete)
    }
    this.props.onHide()
  }

  render () {
    const popupTitle = DynamicPopup.localizations.dynamicContent || 'Dynamic Content'
    const saveText = DynamicPopup.localizations.save || 'Save'
    const closeText = DynamicPopup.localizations.close || 'Close'
    const replaceStaticContentWithDynamicContent = DynamicPopup.localizations ? DynamicPopup.localizations.replaceStaticContentWithDynamicContent : 'Replace static content with <a href="https://help.visualcomposer.com/docs/features/dynamic-content/?utm_source=vcwb&utm_medium=editor&utm_campaign=info&utm_content=helper-point" target="_blank" rel="noopener noreferrer">dynamic content</a> placeholders (WordPress default and custom fields).'

    const showModal = true
    const { elementAccessPoint, fieldType, value, renderExtraOptions } = this.props

    return (
      <Modal
        show={showModal}
        onClose={this.handleCloseClick}
      >
        <div className='vcv-ui-modal'>
          <header className='vcv-ui-modal-header'>
            <h1 className='vcv-ui-modal-header-title'>{popupTitle}</h1>
            <div className='vcv-ui-modal-header-tooltip'>
              <Tooltip
                relativeElementSelector='.vcv-ui-modal-content'
              >
                {replaceStaticContentWithDynamicContent}
              </Tooltip>
            </div>
            <span className='vcv-ui-modal-close' onClick={this.handleCloseClick} title={closeText}>
              <i className='vcv-ui-modal-close-icon vcv-ui-icon vcv-ui-icon-close' />
            </span>
          </header>
          <section className='vcv-ui-modal-content'>
            <DynamicPopupContent
              elementAccessPoint={elementAccessPoint}
              fieldType={fieldType}
              value={value}
              renderExtraOptions={renderExtraOptions}
              handleCurrentPostFieldChange={this.onCurrentPostFieldChange}
              handleSourceIdChange={this.onSourceIdChange}
              handleShowAutocompleteChange={this.onShowAutocompleteChange}
              sourceId={this.state.sourceId}
              currentPostField={this.state.currentPostField}
              showAutocomplete={this.state.showAutocomplete}
              onlyDynamicCustomFields={this.props.onlyDynamicCustomFields}
            />
          </section>
          <footer className='vcv-ui-modal-footer'>
            <div className='vcv-ui-modal-actions'>
              <span className='vcv-ui-modal-action' title={saveText} onClick={this.handleSaveClick}>
                <span className='vcv-ui-modal-action-content'>
                  <i className='vcv-ui-modal-action-icon vcv-ui-icon vcv-ui-icon-save' />
                  <span>{saveText}</span>
                </span>
              </span>
            </div>
          </footer>
        </div>
      </Modal>
    )
  }
}
