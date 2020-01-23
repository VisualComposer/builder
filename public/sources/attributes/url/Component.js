import React from 'react'
import lodash from 'lodash'
import Modal from 'public/components/modal/modal'
import Attribute from '../attribute'
import String from '../string/Component'
import Checkbox from '../checkbox/Component'
import classNames from 'classnames'
import UrlDropdownInput from './UrlDropdownInput'
import { getResponse } from 'public/tools/response'
import { getService } from 'vc-cake'
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

export default class Url extends Attribute {
  static defaultProps = {
    fieldType: 'url'
  }

  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.delayedSearch = lodash.debounce(this.performSearch, 800)
    this.open = this.open.bind(this)
    this.handleDynamicChange = this.handleDynamicChange.bind(this)
    this.renderExtraDynamicOptions = this.renderExtraDynamicOptions.bind(this)
    this.handleDynamicOpen = this.handleDynamicOpen.bind(this)
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

  loadPosts (search) {
    this.ajaxPost({
      'vcv-action': 'attribute:linkSelector:getPosts:adminNonce',
      'vcv-search': search,
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, (request) => {
      const posts = getResponse(request.response)
      if (posts) {
        pagePosts.set(posts)
        this.setState({ updateState: !this.state.updateState })
      }
    })
  }

  open (e) {
    e && e.preventDefault()
    const unsavedValue = {}
    Object.assign(unsavedValue, this.state.value)

    this.setState({
      unsavedValue: unsavedValue,
      isWindowOpen: true
    })

    if (this.state.shouldRenderExistingPosts && !pagePosts.get().length) {
      this.loadPosts()
    }
  }

  hide () {
    this.setState({
      isWindowOpen: false,
      unsavedValue: {}
    })
    this.loadPosts()
  }

  cancel = (e) => {
    this.hide()
  }

  save = (e) => {
    e.preventDefault()
    const valueToSave = Object.assign({}, this.state.unsavedValue)

    this.setFieldValue(valueToSave)
    this.hide()
  }

  handleInputChange = (fieldKey, value) => {
    const unsavedValue = this.state.unsavedValue

    // Checkboxes return either ['1'] or []. Cast to boolean.
    if (['targetBlank', 'relNofollow'].indexOf(fieldKey) !== -1) {
      value = value.length > 0
    }

    unsavedValue[fieldKey] = value

    this.setState({ unsavedValue: unsavedValue })
  }

  handlePostSelection = (e, url) => {
    e && e.preventDefault()

    this.urlInput.setFieldValue(url)
  }

  renderExistingPosts = () => {
    const noExistingContentFound = this.localizations ? this.localizations.noExistingContentFound : 'Nothing found'
    const items = []

    if (!pagePosts.get().length) {
      return (
        <div className='vcv-ui-form-message'>
          {noExistingContentFound}
        </div>
      )
    }
    pagePosts.get().forEach((post) => {
      const rowClassName = classNames({
        'vcv-ui-form-table-link-row': true,
        'vcv-ui-state--active': this.state.unsavedValue.url === post.url
      })
      items.push(
        <tr
          key={'vcv-selectable-post-url-' + post.id} className={rowClassName}
          onClick={(e) => this.handlePostSelection(e, post.url)}
        >
          <td>
            <a href={post.url} onClick={(e) => { e && e.preventDefault() }}>{post.title}</a>
          </td>
          <td>
            <div className='vcv-ui-form-table-link-type' title={post.type.toUpperCase()}>
              {post.type.toUpperCase()}
            </div>
          </td>
        </tr>
      )
    })

    return (
      <table className='vcv-ui-form-table'>
        <tbody>
          {items}
        </tbody>
      </table>
    )
  }

  renderExistingPostsBlock () {
    const linkToExistingContent = this.localizations ? this.localizations.linkToExistingContent : 'Or link to existing content'
    const searchExistingContent = this.localizations ? this.localizations.searchExistingContent : 'Search existing content'
    if (!this.state.shouldRenderExistingPosts) {
      return
    }

    return (
      <div className='vcv-ui-form-group'>
        <p className='vcv-ui-form-helper'>
          {linkToExistingContent}
        </p>
        <div className='vcv-ui-input-search'>
          <input
            type='search' className='vcv-ui-form-input'
            onChange={this.onSearchChange}
            placeholder={searchExistingContent}
          />
          <label className='vcv-ui-form-input-search-addon'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
        </div>

        {this.renderExistingPosts()}
      </div>
    )
  }

  onSearchChange = (e) => {
    e.persist()
    this.delayedSearch(e)
  }

  performSearch = (e) => {
    const keyword = e.target.value
    this.loadPosts(keyword)
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
          updater={this.handleInputChange}
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
          updater={this.handleInputChange}
        />
        <Checkbox
          fieldKey='relNofollow'
          fieldType='checkbox'
          options={{ values: [{ label: addNofollow, value: '1' }] }}
          api={this.props.api}
          value={this.state.unsavedValue.relNofollow ? ['1'] : []}
          updater={this.handleInputChange}
        />
      </div>
    )
  }

  drawModal () {
    const insertEditLink = this.localizations ? this.localizations.insertEditLink : 'Insert or Edit Link'
    const enterDestinationUrl = this.localizations ? this.localizations.enterDestinationUrl : 'Enter destination URL'
    const save = this.localizations ? this.localizations.save : 'Save'
    const close = this.localizations ? this.localizations.close : 'Close'
    return (
      <Modal
        show={this.state.isWindowOpen}
        onClose={this.cancel}
      >

        <div className='vcv-ui-modal'>

          <header className='vcv-ui-modal-header'>
            <span className='vcv-ui-modal-close' onClick={this.cancel} title={close}>
              <i className='vcv-ui-modal-close-icon vcv-ui-icon vcv-ui-icon-close' />
            </span>
            <h1 className='vcv-ui-modal-header-title'>{insertEditLink}</h1>
          </header>

          <section className='vcv-ui-modal-content'>
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
                updater={this.handleInputChange}
              />
            </div>
            {this.renderTitleInput()}
            {this.renderCheckboxes()}
            {this.renderExistingPostsBlock()}
          </section>

          <footer className='vcv-ui-modal-footer'>
            <div className='vcv-ui-modal-actions'>
              <span className='vcv-ui-modal-action' title={save} onClick={this.save}>
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

  handleDynamicChange (value) {
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
        onClick={this.open}
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
          setFieldValue={this.handleDynamicChange}
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
