import React from 'react'
import lodash from 'lodash'
import Modal from 'public/components/modal/modal'
import Attribute from '../attribute'
import String from '../string/Component'
import Checkbox from '../checkbox/Component'
import UrlDropdownInput from './UrlDropdownInput'
import PostsBlock from './PostsBlock'
import PostsDropdown from './PostsDropdown'
import { getResponse } from 'public/tools/response'
import { getService, getStorage, env } from 'vc-cake'
import DynamicAttribute from '../dynamicField/dynamicAttribute'
import Tooltip from '../../../components/tooltip/tooltip'

const dataManager = getService('dataManager')
const { getBlockRegexp } = getService('utils')
const blockRegexp = getBlockRegexp()
const popupStorage = getStorage('popup')
const hubStorage = getStorage('hubAddons')

const pagePosts = {
  data: [],
  set (posts) {
    this.data = posts
  },
  get () {
    return this.data
  },
  clear () {
    this.data = []
  }
}

const pagePopups = {
  data: [],
  set (posts) {
    this.data = posts
  },
  get () {
    return this.data
  },
  clear () {
    this.data = []
  }
}

export default class Url extends Attribute {
  static defaultProps = {
    fieldType: 'url'
  }

  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)
    this.postRequest = null
    this.postAction = 'attribute:linkSelector:getPosts:adminNonce'
    this.popupAction = 'attribute:linkSelector:getPopups:adminNonce'
    this.delayedSearch = lodash.debounce(this.performSearch, 300)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.dynamicAttributeChange = this.dynamicAttributeChange.bind(this)
    this.renderExtraDynamicOptions = this.renderExtraDynamicOptions.bind(this)
    this.handleDynamicOpen = this.handleDynamicOpen.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.setPagePosts = this.setPagePosts.bind(this)
    this.setPopupPosts = this.setPopupPosts.bind(this)
    this.handlePopupHtmlLoad = this.handlePopupHtmlLoad.bind(this)
  }

  componentWillUnmount () {
    if (this.postRequest) {
      this.postRequest.abort()
    }
  }

  updateState (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = {
        url: '',
        title: '',
        targetBlank: false,
        relNofollow: false
      }
    }

    if (env('VCV_POPUP_BUILDER') && this.props.value.type) {
      value.type = this.props.value.type
    }

    pagePosts.clear()
    return {
      value: value,
      unsavedValue: value,
      isWindowOpen: (this.state && this.state.isWindowOpen) || false,
      updateState: false,
      shouldRenderExistingPosts: !!dataManager.get('ajaxUrl'),
      isRequestInProcess: false
    }
  }

  ajaxPost (data, successCallback, failureCallback) {
    if (this.postRequest) {
      this.postRequest.abort()
    }
    const request = new window.XMLHttpRequest()
    request.open('POST', dataManager.get('ajaxUrl'), true)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        successCallback.call(this, request)
      } else {
        if (typeof failureCallback === 'function') {
          failureCallback.call(this, request)
        }
      }
    }.bind(this)
    request.send(window.jQuery.param(data))
    this.postRequest = request
  }

  loadPosts (search, action, successCallback) {
    this.setState({
      isRequestInProcess: true
    })
    this.ajaxPost({
      'vcv-action': action,
      'vcv-search': search,
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-source-id': dataManager.get('sourceID')
    }, (request) => {
      const posts = getResponse(request.response)
      this.postRequest = null
      if (posts) {
        this.setState({
          isRequestInProcess: false
        })
        successCallback(posts)
      }
    }, () => {
      this.postRequest = null
      this.setState({
        isRequestInProcess: false
      })
    })
  }

  handleOpen (e) {
    e && e.preventDefault()
    const unsavedValue = {}
    Object.assign(unsavedValue, this.state.value)

    this.setState({
      unsavedValue: unsavedValue,
      isWindowOpen: true
    })

    if (this.state.value.type === 'popup') {
      if (this.state.shouldRenderExistingPosts && !pagePopups.get().length) {
        this.loadPosts('', this.popupAction, this.setPopupPosts)
      }
    } else {
      if (this.state.shouldRenderExistingPosts && !pagePosts.get().length) {
        this.loadPosts('', this.postAction, this.setPagePosts)
      }
    }
  }

  setPagePosts (posts) {
    pagePosts.set(posts)
    this.setState({ updateState: !this.state.updateState })
  }

  setPopupPosts (posts) {
    pagePopups.set(posts)
    this.setState({ updateState: !this.state.updateState })
  }

  handleClose () {
    this.setState({
      isWindowOpen: false,
      unsavedValue: {},
      isSaveInProgress: false
    })
    popupStorage.state('popupAddInProgress').ignoreChange(this.handlePopupHtmlLoad)
    if (this.state.value.type === 'popup') {
      this.loadPosts('', this.popupAction, this.setPopupPosts)
    } else {
      this.loadPosts('', this.postAction, this.setPagePosts)
    }
  }

  handleSaveClick = (e) => {
    e.preventDefault()
    const valueToSave = Object.assign({}, this.state.unsavedValue)
    this.setFieldValue(valueToSave)

    if (valueToSave.type === 'popup' && valueToSave.url) {
      this.setState({
        isSaveInProgress: true
      })
      popupStorage.state('popupAddInProgress').onChange(this.handlePopupHtmlLoad)
    } else {
      window.setTimeout(() => {
        this.handleClose()
      }, 1)
    }
  }

  handlePopupHtmlLoad (addInProgress) {
    if (!addInProgress) {
      this.setState({
        isSaveInProgress: false
      })
      popupStorage.state('popupAddInProgress').ignoreChange(this.handlePopupHtmlLoad)
      window.setTimeout(() => {
        this.handleClose()
      }, 1)
    }
  }

  inputChange = (fieldKey, value) => {
    const unsavedValue = this.state.unsavedValue

    // Checkboxes return either ['1'] or []. Cast to boolean.
    if (['targetBlank', 'relNofollow'].indexOf(fieldKey) !== -1) {
      value = value.length > 0
    }

    unsavedValue[fieldKey] = value

    this.setState({ unsavedValue: unsavedValue })
  }

  handlePostSelection = (e, url, id, popupTitle) => {
    e && e.preventDefault()

    if (this.state.unsavedValue.type && this.state.unsavedValue.type === 'popup') {
      this.setState({
        unsavedValue: {
          url: id,
          type: 'popup',
          popupTitle: popupTitle
        }
      })
    } else {
      this.urlInput.setFieldValue(url)
    }
  }

  performSearch = (e) => {
    const keyword = e.target.value
    this.loadPosts(keyword, this.postAction, this.setPagePosts)
  }

  handleSearchChange = (e) => {
    e.persist()
    this.delayedSearch(e)
  }

  renderTitleInput () {
    const title = this.localizations ? this.localizations.title : 'Title'
    const titleAttributeText = this.localizations ? this.localizations.titleAttributeText : 'The title attribute will be displayed on the link hover.'

    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>
            {title}
          </span>
          <Tooltip
            relativeElementSelector='.vcv-ui-modal-content'
          >
            {titleAttributeText}
          </Tooltip>
        </div>
        <String
          fieldKey='title'
          value={this.state.unsavedValue.title || ''}
          api={this.props.api}
          updater={this.inputChange}
        />
      </div>
    )
  }

  renderCheckboxes () {
    const openLinkInTab = this.localizations ? this.localizations.openLinkInTab : 'Open the link in a new tab'
    const addNofollow = this.localizations ? this.localizations.addNofollow : 'Add "nofollow" option to the link'

    return (
      <div className='vcv-ui-form-group'>
        <Checkbox
          fieldKey='targetBlank'
          fieldType='checkbox'
          options={{ values: [{ label: openLinkInTab, value: '1' }] }}
          value={this.state.unsavedValue.targetBlank ? ['1'] : []}
          api={this.props.api}
          updater={this.inputChange}
        />
        <Checkbox
          fieldKey='relNofollow'
          fieldType='checkbox'
          options={{ values: [{ label: addNofollow, value: '1' }] }}
          api={this.props.api}
          value={this.state.unsavedValue.relNofollow ? ['1'] : []}
          updater={this.inputChange}
        />
      </div>
    )
  }

  handleContentChange (e) {
    const unsavedValue = {
      url: '',
      title: ''
    }
    if (e.target.value === 'popup') {
      unsavedValue.type = 'popup'
      this.loadPosts('', this.popupAction, this.setPopupPosts)
    } else if (e.target.value === 'close-popup') {
      unsavedValue.type = 'close-popup'
      unsavedValue.url = '#close-popup'
    } else {
      this.loadPosts('', this.postAction, this.setPagePosts)
    }
    this.setState({
      unsavedValue: unsavedValue
    })
  }

  drawModal () {
    const insertEditLink = this.localizations ? this.localizations.insertEditLink : 'Insert or edit a link'
    const onClickAction = this.localizations ? this.localizations.onClickAction : 'OnClick action'
    const save = this.localizations ? this.localizations.save : 'Save'
    const close = this.localizations ? this.localizations.close : 'Close'
    const urlText = this.localizations ? this.localizations.url : 'URL'
    let openPopupText = this.localizations ? this.localizations.openPopup : 'Open Popup'
    const closePopupText = this.localizations ? this.localizations.closePopup : 'Close Popup'
    const closingThePopupDescription = this.localizations ? this.localizations.closingThePopupDescription : 'Closing the popup option will close the current popup.'
    const downloadPopupBuilder = this.localizations ? this.localizations.downloadPopupBuilder : 'Download Popup Builder'
    const availableInPremiumText = this.localizations ? this.localizations.availableInPremiumText : 'Available in Premium'

    let optionDropdown = null
    let modalContent = null
    const dropdownValue = this.state.unsavedValue.type ? this.state.unsavedValue.type : 'url'

    const editorType = dataManager.get('editorType')
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const isAddonAvailable = hubStorage.state('addons').get() && hubStorage.state('addons').get().popupBuilder
    if (isPremiumActivated) {
      if (!isAddonAvailable) {
        openPopupText = `${openPopupText} (${downloadPopupBuilder})`
      }
    } else {
      openPopupText = `${openPopupText} (${availableInPremiumText})`
    }
    optionDropdown = (
      <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            {onClickAction}
          </span>
        <select
          className='vcv-ui-form-dropdown'
          onChange={this.handleContentChange}
          value={dropdownValue}
        >
          <option value='url'>{urlText}</option>
          <option value='popup' disabled={!isPremiumActivated || (isPremiumActivated && !isAddonAvailable)}>{openPopupText}</option>
          {editorType === 'popup' ? <option value='close-popup'>{closePopupText}</option> : null}
        </select>
      </div>
    )

    if (this.state.unsavedValue.type === 'close-popup') {
      modalContent = (
        <div>
          <p className='vcv-ui-form-helper'>
            {closingThePopupDescription}
          </p>
        </div>
      )
    } else if (this.state.unsavedValue.type === 'popup') {
      modalContent = (
        <div>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              Popup
            </span>
            <PostsDropdown
              posts={pagePopups}
              onPostSelection={this.handlePostSelection}
              shouldRenderExistingPosts={this.state.shouldRenderExistingPosts}
              value={this.state.unsavedValue}
              isRequestInProcess={this.state.isRequestInProcess}
            />
          </div>
        </div>
      )
    } else {
      modalContent = (
        <div>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              URL
            </span>
            <UrlDropdownInput
              fieldKey='url'
              ref={(c) => { this.urlInput = c }}
              api={this.props.api}
              value={this.state.unsavedValue.url || ''}
              updater={this.inputChange}
            />
          </div>
          {this.renderTitleInput()}
          {this.renderCheckboxes()}
          <PostsBlock
            posts={pagePosts}
            onSearchChange={this.handleSearchChange}
            onPostSelection={this.handlePostSelection}
            shouldRenderExistingPosts={this.state.shouldRenderExistingPosts}
            value={this.state.unsavedValue}
            isRequestInProcess={this.state.isRequestInProcess}
          />
        </div>
      )
    }

    let saveButtonContent = (
      <span className='vcv-ui-modal-action' title={save} onClick={this.handleSaveClick}>
        <span className='vcv-ui-modal-action-content'>
          <i className='vcv-ui-modal-action-icon vcv-ui-icon vcv-ui-icon-save' />
          <span>save</span>
        </span>
      </span>
    )

    if (this.state.isSaveInProgress) {
      saveButtonContent = (
        <span className='vcv-ui-modal-action'>
          <span className='vcv-ui-modal-action-content'>
            <span className='vcv-ui-wp-spinner' />
          </span>
        </span>
      )
    }

    return (
      <Modal
        show={this.state.isWindowOpen}
        onClose={this.handleClose}
      >
        <div className='vcv-ui-modal'>
          <header className='vcv-ui-modal-header'>
            <h1 className='vcv-ui-modal-header-title'>{insertEditLink}</h1>
            <span className='vcv-ui-modal-close' onClick={this.handleClose} title={close}>
              <i className='vcv-ui-modal-close-icon vcv-ui-icon vcv-ui-icon-close' />
            </span>
          </header>

          <section className='vcv-ui-modal-content'>
            {optionDropdown}
            {modalContent}
          </section>

          <footer className='vcv-ui-modal-footer'>
            <div className='vcv-ui-modal-actions'>
              {saveButtonContent}
            </div>
          </footer>
        </div>
      </Modal>
    )
  }

  dynamicAttributeChange (value) {
    const valueToSave = Object.assign({}, this.state.unsavedValue)
    if (value && typeof value === 'string' && value.match(blockRegexp)) {
      valueToSave.url = value
    } else {
      valueToSave.url = value.url
    }
    this.setFieldValue(valueToSave)
  }

  renderExtraDynamicOptions () {
    return (
      <>
        {this.renderTitleInput()}
        {this.renderCheckboxes()}
      </>
    )
  }

  handleDynamicOpen () {
    const unsavedValue = {}
    Object.assign(unsavedValue, this.state.value)

    this.setState({
      unsavedValue: unsavedValue
    })
  }

  customDynamicRender (dynamicApi) {
    const { dynamicFieldOpened, isWindowOpen } = dynamicApi.state

    let content = ''
    if (dynamicFieldOpened) {
      content = dynamicApi.renderDynamicInputs()
    } else {
      content = (
        <>
          <div className='vcv-ui-form-link-button-group'>
            {dynamicApi.props.linkButton}
            {dynamicApi.renderOpenButton()}
          </div>
          {dynamicApi.props.linkDataComponent}
        </>
      )
    }

    return (
      <>
        {content}
        {isWindowOpen ? dynamicApi.getDynamicPopup() : null}
      </>
    )
  }

  render () {
    const { title, url, popupTitle, type } = this.state.value
    const selectUrl = this.localizations ? this.localizations.selectUrl : 'Select a URL'
    const addLink = this.localizations ? this.localizations.addLink : 'Add a link'

    let linkDataHtml = null
    if (type && type === 'popup') {
      const popupPageTitle = popupTitle || (url && url.replace('#vcv-popup-', '')) || ''
      linkDataHtml = (
        <div className='vcv-ui-form-link-data'>
          <span
            className='vcv-ui-form-link-title'
            data-vc-link-title='Popup: '
            title={popupPageTitle}
          >
            {popupPageTitle}
          </span>
          {this.drawModal()}
        </div>
      )
    } else if (type && type === 'close-popup') {
      const popupPageTitle = 'Close Popup'
      linkDataHtml = (
        <div className='vcv-ui-form-link-data'>
          <span
            className='vcv-ui-form-link-title'
            title={popupPageTitle}
          >
            {popupPageTitle}
          </span>
          {this.drawModal()}
        </div>
      )
    } else {
      linkDataHtml = (
        <div className='vcv-ui-form-link-data'>
          <span
            className='vcv-ui-form-link-title'
            data-vc-link-title='Title: '
            title={title}
          >
            {title}
          </span>
          <span
            className='vcv-ui-form-link-title'
            data-vc-link-title='Url: '
            title={url}
          >
            {url}
          </span>
          {this.drawModal()}
        </div>
      )
    }
    let linkButtonText = <span>{selectUrl}</span>
    if (this.props.imageLink && this.props.options.dynamicField) {
      linkButtonText = null
    }
    const linkButton = (
      <button
        className='vcv-ui-form-link-button vcv-ui-form-button vcv-ui-form-button--default'
        onClick={this.handleOpen}
        type='button'
        title={addLink}
      >
        <i className='vcv-ui-icon vcv-ui-icon-link' />
        {linkButtonText}
      </button>
    )

    return (
      <div className='vcv-ui-form-link'>
        <DynamicAttribute
          {...this.props}
          setFieldValue={this.dynamicAttributeChange}
          value={url}
          renderExtraOptions={this.renderExtraDynamicOptions}
          onOpenClick={this.handleDynamicOpen}
          render={this.customDynamicRender.bind(this)}
          linkDataComponent={linkDataHtml}
          linkButton={linkButton}
        >
          {linkButton}
          {linkDataHtml}
        </DynamicAttribute>
      </div>
    )
  }
}
