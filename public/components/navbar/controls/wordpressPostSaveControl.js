import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'

const PostData = vcCake.getService('wordpress-post-data')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
const SAVED_TIMEOUT = 3000 // TODO: Check magic timeout variable(3s)

export default class WordPressPostSaveControl extends NavbarContent {
  timer = 0

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      loading: false,
      status: ''
    }
    this.updateControlOnStatusChange = this.updateControlOnStatusChange.bind(this)
    this.clickSaveData = this.clickSaveData.bind(this)
    this.handleIframeChange = this.handleIframeChange.bind(this)
  }

  updateControlOnStatusChange (data, source = '') {
    const status = data.status
    if (status === 'saving' && source !== 'postSaveControl') {
      this.clickSaveData({ options: data.options }, {}, {}, true)
      return
    }
    if (status === 'success') {
      this.setState({
        status: 'success'
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
    } else if (data && data.type === 'layoutLoaded') {
      this.setState({ loading: false })
      if (this.state.status === 'saving') {
        this.setState({ status: '' })
        this.clickSaveData()
      }
    }
  }

  clearTimer () {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
  }

  clickSaveData (e, _, __, noStorageRequest = false) {
    e && e.preventDefault && e.preventDefault()

    if (this.state.status === 'saving') {
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
      const url = window.location.href
      const captureType = /vcv-editor-type=([^&]+)/.exec(url)
      if ((vcCake.env('VCV_JS_THEME_EDITOR') || vcCake.env('VCV_JS_ARCHIVE_TEMPLATE')) && captureType && captureType[1]) {
        window.history.replaceState({}, '', `post.php?post=${window.vcvSourceID}&action=edit&vcv-action=frontend&vcv-source-id=${window.vcvSourceID}&vcv-editor-type=${captureType[1]}`)
      } else {
        window.history.replaceState({}, '', `post.php?post=${window.vcvSourceID}&action=edit&vcv-action=frontend&vcv-source-id=${window.vcvSourceID}`)
      }
      // Check Save option from other modules
      !noStorageRequest && wordpressDataStorage.trigger('save', {
        options: e ? e.options : {}
      }, 'postSaveControl')
    }, 1)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const saveButtonClasses = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--success': this.state.status === 'success',
      'vcv-ui-state--error': this.state.status === 'error'
    })
    const saveIconClasses = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-wp-spinner-light': this.state.status === 'saving',
      'vcv-ui-icon': this.state.status !== 'saving',
      'vcv-ui-icon-save': this.state.status !== 'saving'
    })
    let saveText = localizations.publish
    if (!PostData.canPublish()) {
      saveText = localizations.submitForReview
    }
    if (PostData.isPublished()) {
      saveText = localizations.update
    }

    return (
      <div className='vcv-ui-navbar-controls-group vcv-ui-pull-end'>
        <span
          className={saveButtonClasses}
          title={saveText}
          onClick={this.clickSaveData}
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className={saveIconClasses} />
            <span>{saveText}</span>
          </span>
        </span>
      </div>
    )
  }
}
