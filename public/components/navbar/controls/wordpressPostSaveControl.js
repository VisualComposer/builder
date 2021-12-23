import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const PostData = vcCake.getService('wordpress-post-data')
const dataManager = vcCake.getService('dataManager')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
const settingsStorage = vcCake.getStorage('settings')
const SAVED_TIMEOUT = 3000

export default class WordPressPostSaveControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)
  static localizations = dataManager.get('localizations')

  timer = 0

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      loading: false,
      status: dataManager.get('editorType') === 'vcv_tutorials' ? 'disabled' : '',
      isOptionsActive: false,
      isNewPost: dataManager.get('postData').status === 'auto-draft'
    }
    this.updateControlOnStatusChange = this.updateControlOnStatusChange.bind(this)
    this.handleClickSaveData = this.handleClickSaveData.bind(this)
    this.handleIframeChange = this.handleIframeChange.bind(this)
    this.handleClickSaveDraft = this.handleClickSaveDraft.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.layoutNotification = this.layoutNotification.bind(this)
  }

  updateControlOnStatusChange (data, source = '') {
    const status = data.status
    const successMessage = WordPressPostSaveControl.localizations ? WordPressPostSaveControl.localizations.postSaved : 'The content has been successfully saved.'
    const failMessage = WordPressPostSaveControl.localizations ? WordPressPostSaveControl.localizations.postSavedFailed : 'Failed to save the content.'
    if (status === 'saving' && source !== 'postSaveControl') {
      this.handleClickSaveData({ options: data.options }, {}, {}, true)
      return
    }
    if (status === 'success') {
      this.layoutNotification()
      this.setState({
        status: 'success',
        isOptionsActive: false,
        isNewPost: dataManager.get('postData').status === 'auto-draft'
      })
      this.clearTimer()
      // Show success at least for 3 secs
      this.timer = setTimeout(
        () => {
          this.setState({
            saving: false,
            status: ''
          })
        },
        SAVED_TIMEOUT
      )
      store.dispatch(notificationAdded({
        type: 'success',
        text: successMessage,
        time: 5000
      }))
    } else if (status === 'failed') {
      this.setState({
        status: 'error',
        isNewPost: dataManager.get('postData').status === 'auto-draft'
      })
      this.clearTimer()
      // Show error at least for 3 secs
      this.timer = setTimeout(
        () => {
          this.setState({
            saving: false,
            status: ''
          })
        },
        SAVED_TIMEOUT
      )
      store.dispatch(notificationAdded({
        type: 'error',
        text: failMessage,
        time: 5000
      }))
    }
  }

  componentDidMount () {
    wordpressDataStorage.state('status').onChange(this.updateControlOnStatusChange)
    workspaceIFrame.onChange(this.handleIframeChange)
  }

  componentWillUnmount () {
    wordpressDataStorage.state('status').ignoreChange(this.updateControlOnStatusChange)
    workspaceIFrame.ignoreChange(this.handleIframeChange)
  }

  handleIframeChange (data) {
    if (data && data.type === 'reload') {
      this.setState({ loading: true })
    } else if (data && (data.type === 'layoutLoaded' || data.type === 'loaded')) {
      this.setState({ loading: false })
      if (this.state.status === 'saving') {
        this.setState({ status: '' })
        this.handleClickSaveData()
      }
    }
  }

  clearTimer () {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
  }

  handleClickSaveData (e, _, __, noStorageRequest = false) {
    e && e.preventDefault && e.preventDefault()

    if (this.state.status === 'saving' || this.state.status === 'disabled' || !e) {
      return
    }
    this.clearTimer()
    this.setState({
      status: 'saving'
    })
    if (this.state.loading) {
      return
    }
    window.setTimeout(() => {
      const sourceID = dataManager.get('sourceID')
      let urlQuery = `post.php?post=${sourceID}&action=edit&vcv-action=frontend&vcv-source-id=${sourceID}`
      if (window.location.href.indexOf('vcv-editor-type') !== -1) {
        // we have editor type. so add it always
        const urlObject = new URL(window.location.href)
        urlQuery += '&vcv-editor-type=' + urlObject.searchParams.get('vcv-editor-type')
      }
      window.history.replaceState({}, '', urlQuery)
      // Check Save option from other modules
      !noStorageRequest && wordpressDataStorage.trigger('save', {
        options: e ? e.options : {}
      }, 'postSaveControl')
    }, 1)
    this.handleDropdownVisibility(e)
    this.props.handleOnClick && this.props.handleOnClick(e)
  }

  handleClickSaveDraft (e) {
    e && e.preventDefault && e.preventDefault()
    wordpressDataStorage.trigger('save', { draft: true }, 'wordpressAdminControl')
    this.handleDropdownVisibility(e)
    this.props.handleOnClick && this.props.handleOnClick(e)
  }

  handleSave (e) {
    this.handleClickSaveData(e)
    this.handleDropdownVisibility(e)
    this.props.handleOnClick && this.props.handleOnClick(e)
  }

  layoutNotification () {
    if (this.state.isNewPost === true && dataManager.get('editorType') === 'vcv_layouts') {
      const layoutType = settingsStorage.state('layoutType').get()
      let message = ''
      const adminLink = window && window.vcvWpAdminUrl ? window.vcvWpAdminUrl : ''
      const layoutSettingsLink = adminLink + 'admin.php?page=vcv-headers-footers'
      const defaultMessage = `Created template is not assigned to any post {location}. To assign, navigate to <a href='${layoutSettingsLink}'>Theme Builder Settings</a>`
      if (layoutType === 'postTemplate') {
        message = WordPressPostSaveControl.localizations.postTemplateNotification ? WordPressPostSaveControl.localizations.postTemplateNotification : defaultMessage.replace('{location}', 'type')
      } else if (layoutType === 'archiveTemplate') {
        message = WordPressPostSaveControl.localizations.archiveTemplateNotification ? WordPressPostSaveControl.localizations.archiveTemplateNotification : defaultMessage.replace('{location}', 'archive')
      }
      if (message !== '') {
        store.dispatch(notificationAdded({
          position: 'top',
          transparent: false,
          showCloseButton: true,
          rounded: false,
          type: 'warning',
          text: message,
          html: true,
          time: 15000
        }))
      }
    }
  }

  render () {
    const saveButtonClasses = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-navbar-dropdown-trigger': true,
      'vcv-ui-state--disabled': this.state.status === 'disabled'
    })

    const saveIconClasses = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-wp-spinner-light': this.state.status === 'saving',
      'vcv-ui-icon': this.state.status !== 'saving',
      'vcv-ui-icon-save': this.state.status !== 'saving'
    })

    const saveControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-save': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-dropdown--active': this.state.isOptionsActive
    })

    const publishingOptions = WordPressPostSaveControl.localizations.publishingOptions
    let saveText = WordPressPostSaveControl.localizations.publish
    if (!PostData.canPublish()) {
      saveText = WordPressPostSaveControl.localizations.submitForReview
    }
    if (PostData.isPublished()) {
      saveText = WordPressPostSaveControl.localizations.update
    }
    const navbarContentClasses = classNames({
      'vcv-ui-navbar-dropdown-content': true,
      'vcv-ui-show-dropdown-content': this.state.showDropdown,
      'vcv-ui-navbar-show-labels': true,
      'vcv-ui-navbar-dropdown-content--save': true
    })
    const titleText = WordPressPostSaveControl.isMacLike ? saveText + ' (⌘S)' : saveText + ' (Ctrl + S)'
    let controlTitle = titleText
    let saveDraftOptions = null
    if (PostData.isDraft()) {
      controlTitle = publishingOptions

      saveDraftOptions = (
        <>
          <span
            className='vcv-ui-navbar-control'
            title={WordPressPostSaveControl.localizations.saveDraft}
            onClick={this.handleClickSaveDraft}
            data-href={PostData.permalink()}
            data-vcv-control='saveDraft'
          >
            <span className='vcv-ui-navbar-control-content'>{WordPressPostSaveControl.localizations.saveDraft}</span>
          </span>
          <span
            className='vcv-ui-navbar-control'
            title={titleText}
            onClick={this.handleClickSaveData}
            data-href={PostData.permalink()}
            data-vcv-control='publish'
          >
            <span className='vcv-ui-navbar-control-content'>{saveText}</span>
          </span>
        </>
      )
    }

    return (
      <dl
        className={saveControlClasses}
        onMouseLeave={this.handleDropdownVisibility}
        data-vcv-guide-helper='save-control'
      >
        <dt
          className={saveButtonClasses}
          title={controlTitle}
          onClick={this.handleSave}
          onMouseEnter={this.handleDropdownVisibility}
          data-vcv-control='publish'
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className={saveIconClasses} />
            <span>{controlTitle}</span>
          </span>

        </dt>
        <dd className={navbarContentClasses}>
          {this.props.children}
          {saveDraftOptions}
        </dd>
      </dl>
    )
  }
}
