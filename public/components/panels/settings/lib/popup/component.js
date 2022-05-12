import React from 'react'
import { getStorage, getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'
import Tooltip from 'public/components/tooltip/tooltip'
import PremiumTeaser from 'public/components/premiumTeasers/component'

const settingsStorage = getStorage('settings')
const hubStorage = getStorage('hubAddons')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

export default class Popup extends React.Component {
  constructor (props) {
    super(props)
    const settingsPopup = settingsStorage.state('settingsPopup').get() || {}
    this.state = {
      isRequestInProcess: false,
      popupOnPageLoad: settingsPopup.popupOnPageLoad || { delay: 0, expires: 0 },
      popupOnExitIntent: settingsPopup.popupOnExitIntent || { expires: 0 },
      popupOnElementId: settingsPopup.popupOnElementId || { delay: 0, expires: 0, elementIdSelector: '' }
    }

    this.popupPosts = settingsStorage.state('popupPosts').get() || []

    if (this.popupPosts < 1) {
      this.loadPosts()
      this.state.isRequestInProcess = true
    }
  }

  componentWillUnmount () {
    if (this.postRequest) {
      this.postRequest.abort()
    }
  }

  ajaxPost (data, successCallback, failureCallback) {
    if (this.postRequest) {
      this.postRequest.abort()
    }
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
    this.postRequest = request
  }

  loadPosts () {
    this.ajaxPost({
      'vcv-action': 'attribute:linkSelector:getPopups:adminNonce',
      'vcv-nonce': dataManager.get('nonce'),
      'vcv-source-id': dataManager.get('sourceID')
    }, (request) => {
      const posts = getResponse(request.response)
      this.postRequest = null
      if (posts && posts.status !== false) {
        this.popupPosts = posts
        settingsStorage.state('popupPosts').set(posts)
      }
      this.setState({
        isRequestInProcess: false
      })
    }, () => {
      this.postRequest = null
      this.setState({
        isRequestInProcess: false
      })
    })
  }

  handleInputChange (type, key, e) {
    const value = e.target.value
    const newState = this.state[type]
    newState[key] = value
    this.setState({
      [type]: newState
    })

    const popupData = settingsStorage.state('settingsPopup').get() || {}

    if (!popupData[type]) {
      popupData[type] = {}
    }

    popupData[type][key] = value
    settingsStorage.state('settingsPopup').set(popupData)
  }

  handleSelectChange (type, e) {
    const id = e.target.value
    const newState = this.state[type]
    newState.id = id
    this.setState({
      [type]: newState
    })

    const popupData = settingsStorage.state('settingsPopup').get() || {}

    if (!popupData[type]) {
      popupData[type] = {}
    }

    if (id) {
      popupData[type].id = id
    } else {
      delete popupData[type]
    }
    settingsStorage.state('settingsPopup').set(popupData)
  }

  getPopupSelectText (value) {
    const localizations = dataManager.get('localizations')
    const globalUrl = 'vcvCreatevcv_popups'
    const createNewUrl = window[globalUrl] ? window[globalUrl] : ''

    if (isNaN(value)) {
      const text = localizations ? localizations.createPopup : '<a href="{link}" target="_blank">Create</a> a new popup.'
      return text.replace('{link}', createNewUrl)
    } else {
      let editLink = window && window.vcvWpAdminUrl ? window.vcvWpAdminUrl : ''
      editLink += `post.php?post=${value}&action=edit`
      const text = localizations ? localizations.editPopup : '<a href="{editLink}" target="_blank">Edit</a> this popup or <a href="{createLink}" target="_blank">create</a> a new one.'
      return text.replace('{editLink}', editLink).replace('{createLink}', createNewUrl)
    }
  }

  renderExistingPosts (type) {
    const none = localizations ? localizations.none : 'None'
    const chooseHFSText = this.getPopupSelectText(this.state[type].id)
    const items = []
    let globalOption = null
    if (type !== 'popupOnElementId') {
      globalOption = <option value=''>Global</option>
    }
    this.popupPosts.forEach((post) => {
      const postTitle = post.title || post.id
      items.push(
        <option
          key={'vcv-selectable-post-url-' + post.id}
          value={post.id}
        >
          {postTitle}
        </option>
      )
    })

    return (
      <>
        <select
          className='vcv-ui-form-dropdown'
          value={this.state[type].id}
          onChange={this.handleSelectChange.bind(this, type)}
        >
          {globalOption}
          <option value='none'>{none}</option>
          {items}
        </select>
        <p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: chooseHFSText }} />
      </>
    )
  }

  getDelayHtml (type) {
    const delayInSeconds = localizations ? localizations.delayInSeconds : 'Delay (seconds)'

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          {delayInSeconds}
        </span>
        <input
          className='vcv-ui-form-input'
          value={this.state[type].delay}
          onChange={this.handleInputChange.bind(this, type, 'delay')}
          type='number'
          min='0'
        />
      </div>
    )
  }

  getShowEveryHtml (type) {
    const showEveryDays = localizations ? localizations.showEveryDays : 'Show every (days)'

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          {showEveryDays}
        </span>
        <input
          className='vcv-ui-form-input'
          value={this.state[type].expires}
          onChange={this.handleInputChange.bind(this, type, 'expires')}
          type='number'
          min='0'
        />
      </div>
    )
  }

  getPopupSettings () {
    let popupSelect = null
    let elementIdSelectorHtml = null
    const popupOpenOnPageLoad = localizations ? localizations.popupOpenOnPageLoad : 'The popup will open once the page is loaded.'
    const popupOpenOnExitIntent = localizations ? localizations.popupOpenOnExitIntent : 'The popup will load if a user tries to exit the page.'
    const popupOpenOnElementId = localizations ? localizations.popupOpenOnElementId : 'The popup will appear when an element with a unique Element ID will be displayed (scrolled to) on the page.'
    const onPageLoad = localizations ? localizations.onPageLoad : 'Popup on every page load'
    const onExitIntent = localizations ? localizations.onExitIntent : 'Popup on exit-intent'
    const onElementId = localizations ? localizations.onElementId : 'Popup on element ID'

    if (this.state.popupOnElementId && this.state.popupOnElementId.id && this.state.popupOnElementId.id !== 'none') {
      elementIdSelectorHtml = (
        <>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              Element ID
            </span>
            <input
              className='vcv-ui-form-input'
              value={this.state.popupOnElementId.elementIdSelector}
              onChange={this.handleInputChange.bind(this, 'popupOnElementId', 'elementIdSelector')}
            />
          </div>
        </>
      )
    }

    if (this.state.isRequestInProcess) {
      popupSelect = (
        <span className='vcv-ui-wp-spinner vcv-ui-settings-popup-panel-spinner' />
      )
    } else {
      popupSelect = (
        <>
          <div className='vcv-ui-form-group'>
            <div className='vcv-ui-form-group-heading-wrapper'>
              <span className='vcv-ui-form-group-heading'>{onPageLoad}</span>
              <Tooltip>
                {popupOpenOnPageLoad}
              </Tooltip>
            </div>
            {this.renderExistingPosts('popupOnPageLoad')}
          </div>
          {this.state.popupOnPageLoad && this.state.popupOnPageLoad.id && this.state.popupOnPageLoad.id !== 'none' ? this.getDelayHtml('popupOnPageLoad') : null}
          {this.state.popupOnPageLoad && this.state.popupOnPageLoad.id && this.state.popupOnPageLoad.id !== 'none' ? this.getShowEveryHtml('popupOnPageLoad') : null}
          <div className='vcv-ui-form-group'>
            <div className='vcv-ui-form-group-heading-wrapper'>
              <span className='vcv-ui-form-group-heading'>{onExitIntent}</span>
              <Tooltip>
                {popupOpenOnExitIntent}
              </Tooltip>
            </div>
            {this.renderExistingPosts('popupOnExitIntent')}
          </div>
          {this.state.popupOnExitIntent && this.state.popupOnExitIntent.id && this.state.popupOnExitIntent.id !== 'none' ? this.getShowEveryHtml('popupOnExitIntent') : null}
          <div className='vcv-ui-form-group'>
            <div className='vcv-ui-form-group-heading-wrapper'>
              <span className='vcv-ui-form-group-heading'>{onElementId}</span>
              <Tooltip>
                {popupOpenOnElementId}
              </Tooltip>
            </div>
            {this.renderExistingPosts('popupOnElementId')}
          </div>
          {elementIdSelectorHtml}
          {this.state.popupOnElementId && this.state.popupOnElementId.id && this.state.popupOnElementId.id !== 'none' ? this.getDelayHtml('popupOnElementId') : null}
          {this.state.popupOnElementId && this.state.popupOnElementId.id && this.state.popupOnElementId.id !== 'none' ? this.getShowEveryHtml('popupOnElementId') : null}
        </>
      )
    }

    return (
      <div className='vcv-ui-tree-content-section-inner'>
        {popupSelect}
      </div>
    )
  }

  getPremiumTeaser (isPremiumActivated) {
    const goPremiumText = localizations.goPremium || 'Go Premium'
    const downloadAddonText = localizations.downloadTheAddon || 'Download Addon'
    const headingText = localizations.popupBuilderPremiumFeatureHeading || 'Popup Builder is a Premium Feature'
    const buttonText = isPremiumActivated ? downloadAddonText : goPremiumText
    const descriptionFree = localizations.popupBuilderPremiumFeatureText || 'Build custom popups with the Visual Composer Popup Builder that is available with the premium version of the plugin.'
    const descriptionPremium = localizations.popupBuilderFeatureActivateAddonText || 'Build custom popups with the Visual Composer Popup Builder. It\'s available in the Visual Composer Hub.'
    const description = isPremiumActivated ? descriptionPremium : descriptionFree
    const utm = dataManager.get('utm')
    const utmUrl = utm['editor-popup-settings-go-premium']

    return (
      <PremiumTeaser
        headingText={headingText}
        buttonText={buttonText}
        description={description}
        url={utmUrl}
        isPremiumActivated={isPremiumActivated}
        addonName='popupBuilder'
      />
    )
  }

  render () {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const isAddonAvailable = hubStorage.state('addons').get() && hubStorage.state('addons').get().popupBuilder

    return isAddonAvailable ? this.getPopupSettings() : this.getPremiumTeaser(isPremiumActivated)
  }
}
