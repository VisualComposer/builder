import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'

const PostData = vcCake.getService('wordpress-post-data')
const dataManager = vcCake.getService('dataManager')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
const SAVED_TIMEOUT = 3000

export default class WordPressPostSaveControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

  timer = 0

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      loading: false,
      status: dataManager.get('editorType') === 'vcv_tutorials' ? 'disabled' : '',
      isOptionsActive: false
    }
    this.updateControlOnStatusChange = this.updateControlOnStatusChange.bind(this)
    this.handleClickSaveData = this.handleClickSaveData.bind(this)
    this.handleIframeChange = this.handleIframeChange.bind(this)
    this.handleClickSaveDraft = this.handleClickSaveDraft.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  updateControlOnStatusChange (data, source = '') {
    const status = data.status
    if (status === 'saving' && source !== 'postSaveControl') {
      this.handleClickSaveData({ options: data.options }, {}, {}, true)
      return
    }
    if (status === 'success') {
      this.setState({
        status: 'success',
        isOptionsActive: false
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
    } else if (status === 'failed') {
      this.setState({
        status: 'error'
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
  }

  handleClickSaveDraft (e) {
    e && e.preventDefault && e.preventDefault()
    wordpressDataStorage.trigger('save', { draft: true }, 'wordpressAdminControl')
  }

  handleSave (e) {
    if (!PostData.isDraft()) {
      this.handleClickSaveData(e)
    }
  }

  render () {
    const localizations = dataManager.get('localizations')

    const publishingOptions = localizations.publishingOptions
    let saveText = localizations.publish
    if (!PostData.canPublish()) {
      saveText = localizations.submitForReview
    }
    if (PostData.isPublished()) {
      saveText = localizations.update
    }

    const titleText = WordPressPostSaveControl.isMacLike ? saveText + ' (⌘S)' : saveText + ' (Ctrl + S)'
    let controlTitle = titleText

    let saveDraftOptions = null
    if (PostData.isDraft()) {
      controlTitle = publishingOptions
      saveDraftOptions = (
        <>
          <span
            className='vcv-ui-navbar-control'
            title={localizations.saveDraft}
            onClick={this.handleClickSaveDraft}
            data-href={PostData.permalink()}
            data-vcv-control='saveDraft'
          >
            <span className='vcv-ui-navbar-control-content'>{localizations.saveDraft}</span>
          </span>
          <span
            className='vcv-ui-navbar-control'
            title={titleText}
            onClick={this.handleClickSaveData}
            data-href={PostData.permalink()}
            data-vcv-control='publish'
          >
            <span className='vcv-ui-navbar-control-content'>{controlTitle}</span>
          </span>
        </>

      )
    }


    return (
      <>
        {saveDraftOptions}
      </>
    )
  }
}
