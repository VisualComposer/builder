import React from 'react'
import lodash from 'lodash'
import Modal from 'public/components/modal/modal'
import Attribute from '../attribute'
import String from '../string/Component'
import Checkbox from '../checkbox/Component'
import UrlDropdownInput from './UrlDropdownInput'
import PostsBlock from './PostsBlock'
import { getResponse } from 'public/tools/response'
import { getService, env } from 'vc-cake'
import DynamicAttribute from '../dynamicField/dynamicAttribute'

const { getBlockRegexp } = getService('utils')
const blockRegexp = getBlockRegexp()

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

  static localizations = window.VCV_I18N && window.VCV_I18N()
  componentUnmounted = false

  constructor (props) {
    super(props)
    this.postAction = 'attribute:linkSelector:getPosts:adminNonce'
    this.popupAction = 'attribute:linkSelector:getPopups:adminNonce'
    this.delayedSearch = lodash.debounce(this.performSearch, 800)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.dynamicAttributeChange = this.dynamicAttributeChange.bind(this)
    this.renderExtraDynamicOptions = this.renderExtraDynamicOptions.bind(this)
    this.handleDynamicOpen = this.handleDynamicOpen.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.setPagePosts = this.setPagePosts.bind(this)
    this.setPopupPosts = this.setPopupPosts.bind(this)
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

    if (env('VCV_POPUP_BUILDER') && this.props.value.type === 'popup') {
      value.type = 'popup'
    }

    pagePosts.clear()
    return {
      value: value,
      unsavedValue: value,
      isWindowOpen: false,
      updateState: false,
      shouldRenderExistingPosts: !!window.vcvAjaxUrl
    }
  }

  ajaxPost (data, successCallback, failureCallback) {
    const request = new window.XMLHttpRequest()
    request.open('POST', window.vcvAjaxUrl, true)
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
  }

  loadPosts (search, action, successCallback) {
    this.ajaxPost({
      'vcv-action': action,
      'vcv-search': search,
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, (request) => {
      const posts = getResponse(request.response)

      if (posts) {
        successCallback(posts)
      }
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

    if (this.state.shouldRenderExistingPosts && !pagePosts.get().length) {
      this.loadPosts('', this.postAction, this.setPagePosts)
    }

    if (this.state.shouldRenderExistingPosts && !pagePopups.get().length) {
      this.loadPosts('', this.popupAction, this.setPopupPosts)
    }
  }

  componentWillUnmount () {
    this.componentUnmounted = true
  }

  setPagePosts (posts) {
    if (!this.componentUnmounted) {
      pagePosts.set(posts)
      this.setState({ updateState: !this.state.updateState })
    }
  }

  setPopupPosts (posts) {
    if (!this.componentUnmounted) {
      pagePopups.set(posts)
      this.setState({ updateState: !this.state.updateState })
    }
  }

  handleClose () {
    this.setState({
      isWindowOpen: false,
      unsavedValue: {}
    })
    this.loadPosts('', this.postAction, this.setPagePosts)
    this.loadPosts('', this.popupAction, this.setPopupPosts)
  }

  handleSaveClick = (e) => {
    e.preventDefault()
    const valueToSave = Object.assign({}, this.state.unsavedValue)
    this.setFieldValue(valueToSave)
    this.handleClose()
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

  handlePostSelection = (e, url, title) => {
    e && e.preventDefault()

    if (this.state.unsavedValue.type && this.state.unsavedValue.type === 'popup') {
      this.setState({
        unsavedValue: {
          url: url,
          type: 'popup'
        }
      })
    } else {
      this.urlInput.setFieldValue(url)
    }
  }

  performSearch = (e) => {
    const keyword = e.target.value
    if (this.state.content === 'url') {
      this.loadPosts(keyword, this.postAction, this.setPagePosts)
    } else {
      this.loadPosts(keyword, this.popupAction, this.setPopupPosts)
    }
  }

  handleSearchChange = (e) => {
    e.persist()
    this.delayedSearch(e)
  }

  renderTitleInput () {
    const title = this.localizations ? this.localizations.title : 'Title'
    const titleAttributeText = this.localizations ? this.localizations.titleAttributeText : 'Title attribute will be displayed on link hover'

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          {title}
        </span>
        <String
          fieldKey='title'
          value={this.state.unsavedValue.title || ''}
          api={this.props.api}
          updater={this.inputChange}
        />
        <p className='vcv-ui-form-helper'>
          {titleAttributeText}
        </p>
      </div>
    )
  }

  renderCheckboxes () {
    const openLinkInTab = this.localizations ? this.localizations.openLinkInTab : 'Open link in a new tab'
    const addNofollow = this.localizations ? this.localizations.addNofollow : 'Add nofollow option to link'

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
    }
    this.setState({
      unsavedValue: unsavedValue
    })
  }

  drawModal () {
    const insertEditLink = this.localizations ? this.localizations.insertEditLink : 'Insert or Edit Link'
    const enterDestinationUrl = this.localizations ? this.localizations.enterDestinationUrl : 'Enter destination URL'
    const onClickAction = this.localizations ? this.localizations.onClickAction : 'OnClick action'
    const save = this.localizations ? this.localizations.save : 'Save'
    const close = this.localizations ? this.localizations.close : 'Close'
    const selectAPopup = this.localizations ? this.localizations.selectAPopup : 'Select a Popup'

    let optionDropdown = null
    let modalContent = null
    const dropdownValue = this.state.unsavedValue.type ? 'popup' : 'url'

    if (env('VCV_POPUP_BUILDER')) {
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
            <option value='url'>Url</option>
            <option value='popup'>Popup</option>
          </select>
        </div>
      )
    }

    if (!this.state.unsavedValue.type || this.state.unsavedValue.type !== 'popup') {
      modalContent = (
        <div>
          <p className='vcv-ui-form-helper'>
            {enterDestinationUrl}
          </p>

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
            type='url'
            posts={pagePosts}
            onSearchChange={this.handleSearchChange}
            onPostSelection={this.handlePostSelection}
            shouldRenderExistingPosts={this.state.shouldRenderExistingPosts}
            value={this.state.unsavedValue}
          />
        </div>
      )
    } else {
      let title = ''
      if (pagePopups.data && pagePopups.data.length && this.state.unsavedValue.url) {
        const activePost = pagePopups.data[pagePopups.data.findIndex(item => item.url === this.state.unsavedValue.url)]
        title = activePost ? activePost.title : ''
      }
      modalContent = (
        <div>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              POPUP
            </span>
            <input
              className='vcv-ui-form-input'
              value={title || selectAPopup}
              onChange={e => this.handlePostSelection(e.target.value)}
            />
          </div>
          <PostsBlock
            type={this.state.unsavedValue.type}
            posts={pagePopups}
            onSearchChange={this.handleSearchChange}
            onPostSelection={this.handlePostSelection}
            shouldRenderExistingPosts={this.state.shouldRenderExistingPosts}
            value={this.state.unsavedValue}
          />
        </div>
      )
    }

    return (
      <Modal
        show={this.state.isWindowOpen}
        onClose={this.handleClose}
      >
        <div className='vcv-ui-modal'>
          <header className='vcv-ui-modal-header'>
            <span className='vcv-ui-modal-close' onClick={this.handleClose} title={close}>
              <i className='vcv-ui-modal-close-icon vcv-ui-icon vcv-ui-icon-close' />
            </span>
            <h1 className='vcv-ui-modal-header-title'>{insertEditLink}</h1>
          </header>

          <section className='vcv-ui-modal-content'>
            {optionDropdown}
            {modalContent}
          </section>

          <footer className='vcv-ui-modal-footer'>
            <div className='vcv-ui-modal-actions'>
              <span className='vcv-ui-modal-action' title={save} onClick={this.handleSaveClick}>
                <span className='vcv-ui-modal-action-content'>
                  <i className='vcv-ui-modal-action-icon vcv-ui-icon vcv-ui-icon-save' />
                  <span>{save}</span>
                </span>
              </span>
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
    const { title, url } = this.state.value
    const selectUrl = this.localizations ? this.localizations.selectUrl : 'Select URL'
    const addLink = this.localizations ? this.localizations.addLink : 'Add Link'
    const linkDataHtml = (
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
