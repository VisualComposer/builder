import {getService, getStorage} from 'vc-cake'
import React from 'react'
import classNames from 'classnames'

const PostData = getService('wordpress-post-data')
const wordpressDataStorage = getStorage('wordpressData')
const SAVED_TIMEOUT = 3000 // TODO: Check magic timeout variable(3s)

export default class WordPressPostSaveControl extends React.Component {
  state = {
    saving: false,
    status: ''
  }
  timer = 0

  constructor (props) {
    super(props)
    this.updateControlOnStatusChange = this.updateControlOnStatusChange.bind(this)
  }

  updateControlOnStatusChange (data, source = '') {
    let status = data.status
    if (status === 'saving' && source !== 'postSaveControl') {
      this.clickSaveData({ options: data.options }, true)
      return
    }
    this.setState({
      saving: status === 'saving',
      status: status
    })
    this.clearTimer()
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

  componentDidMount () {
    wordpressDataStorage.state('status').onChange(this.updateControlOnStatusChange)
  }
  componentWillUnmount () {
    wordpressDataStorage.state('status').ignoreChange(this.updateControlOnStatusChange)
  }
  clearTimer () {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
  }

  clickSaveData = (e, noStorageRequest = false) => {
    e && e.preventDefault && e.preventDefault()

    if (this.state.saving) {
      return
    }
    this.setState({
      saving: true,
      status: ''
    })
    // Check Save option from other modules
    !noStorageRequest && wordpressDataStorage.trigger('save', {
      options: e ? e.options : {}
    }, 'postSaveControl')
  }

  render () {
    let saveButtonClasses = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--success': this.state.status === 'success',
      'vcv-ui-state--error': this.state.status === 'error'
    })
    let saveIconClasses = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-wp-spinner': this.state.saving,
      'vcv-ui-icon': !this.state.saving,
      'vcv-ui-icon-save': !this.state.saving
    })
    let saveText = 'Publish'
    if (!PostData.canPublish()) {
      saveText = 'Submit for Review'
    }
    if (PostData.isPublished()) {
      saveText = 'Update'
    }

    return (
      <div className='vcv-ui-navbar-controls-group vcv-ui-pull-end'>
        <a
          className={saveButtonClasses}
          title={saveText}
          onClick={this.clickSaveData}
        ><span
          className='vcv-ui-navbar-control-content'>
          <i className={saveIconClasses} /><span>{saveText}</span>
        </span></a>
      </div>
    )
  }
}
