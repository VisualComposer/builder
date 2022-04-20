import React from 'react'
import { getStorage, getService, env } from 'vc-cake'
import Attribute from '../attribute'
import { getResponse } from 'public/tools/response'
import { debounce } from 'lodash'

const dataProcessor = getService('dataProcessor')
const settingsStorage = getStorage('settings')
const dataManager = getService('dataManager')

export default class PageSettingsTitle extends Attribute {
  static defaultProps = {
    fieldType: 'pageSettingsTitle'
  }

  constructor (props) {
    super(props)
    this.titleInputRef = React.createRef()
    const pageTitle = settingsStorage.state('pageTitle').get()
    const pageTitleDisabled = settingsStorage.state('pageTitleDisabled').get()
    this.state = {
      current: pageTitle,
      disabled: pageTitleDisabled
    }
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleChangeUpdateTitleToggle = this.handleChangeUpdateTitleToggle.bind(this)
    this.delayedUrlSlugUpdate = debounce(this.updateUrlSlug, 500)

    this.updatePageTitle = this.updatePageTitle.bind(this)
    this.toggleFocusTitle = this.toggleFocusTitle.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('pageTitle').onChange(this.updatePageTitle)
    settingsStorage.state('isTitleFocused').onChange(this.toggleFocusTitle)
  }

  componentWillUnmount () {
    settingsStorage.state('pageTitle').ignoreChange(this.updatePageTitle)
    settingsStorage.state('isTitleFocused').ignoreChange(this.toggleFocusTitle)
  }

  handleChangeTitle (event) {
    const { disabled } = this.state
    let newDisabled = false
    const newValue = event.target.value
    if (newValue) {
      if (!this.state.current) {
        newDisabled = false
      }
    } else {
      newDisabled = true
    }

    const newVar = {
      current: newValue
    }
    if (disabled !== newDisabled) {
      newVar.disabled = newDisabled
      settingsStorage.state('pageTitleDisabled').set(newDisabled)
    }
    this.setState(newVar)
    settingsStorage.state('pageTitle').set(newValue)
    const postData = settingsStorage.state('postData').get()
    postData.post_title = newValue

    settingsStorage.state('postData').set(postData)

    this.delayedUrlSlugUpdate(newValue)

    settingsStorage.state('postData').set(postData)
  }

  updateUrlSlug (newValue) {
    const postData = settingsStorage.state('postData').get()
    postData.post_title = newValue

    if (postData.post_type.toLowerCase() === 'page' && dataManager.get('postData').status === 'auto-draft') {
      dataProcessor.appAllDone().then(() => {
        dataProcessor.appAdminServerRequest(
          {
            'vcv-action': 'settings:parseSlug:adminNonce',
            'vcv-post-name': newValue,
            'vcv-page-title': settingsStorage.state('pageTitle').get()
          }
        ).then(
          this.loadSuccess.bind(this),
          this.loadFailed.bind(this)
        )
      })
    }
  }

  loadSuccess (request) {
    const responseData = getResponse(request)
    if (responseData && responseData.permalinkHtml) {
      settingsStorage.state('permalinkHtml').set(responseData.permalinkHtml)
    }
  }

  loadFailed (request) {
    const responseData = getResponse(request)
    if (env('VCV_DEBUG')) {
      console.warn(responseData)
    }
>>>>>>> master
  }

  updatePageTitle (title) {
    if (title || title === '') {
      this.setState({ current: title })
    }
  }

  toggleFocusTitle (isFocused) {
    if (isFocused) {
      this.titleInputRef.current.focus()
    }
  }

  handleChangeUpdateTitleToggle (event) {
    const checked = event.target.checked
    this.setState({
      disabled: checked
    })

    settingsStorage.state('pageTitleDisabled').set(checked)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const settingName = localizations ? localizations.title : 'Title'
    const pageTitleDisableDescription = localizations ? localizations.pageTitleDisableDescription : 'Disable the page title'
    const checked = (this.state.disabled) ? 'checked' : ''

    const toggleHTML = (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <div className='vcv-ui-form-switch-container'>
          <label className='vcv-ui-form-switch'>
            <input type='checkbox' onChange={this.handleChangeUpdateTitleToggle} id='vcv-page-title-disable' checked={checked} />
            <span className='vcv-ui-form-switch-indicator' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
          </label>
          <label
            htmlFor='vcv-page-title-disable'
            className='vcv-ui-form-switch-trigger-label'
          >{pageTitleDisableDescription}
          </label>
        </div>
      </div>
    )

    const disableTitleToggleControl = !env('VCV_JS_THEME_EDITOR') && dataManager.get('editorType') === 'default' ? toggleHTML : ''

    return (
      <>
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <span className='vcv-ui-form-group-heading'>{settingName}</span>
          <input type='text' className='vcv-ui-form-input' ref={this.titleInputRef} value={this.state.current} onChange={this.handleChangeTitle} onBlur={this.handleBlur} />
        </div>
        {disableTitleToggleControl}
      </>
    )
  }
}
