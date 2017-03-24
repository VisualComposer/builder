import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'

const PostData = vcCake.getService('wordpress-post-data')
// const SAVED_TIMEOUT = 3000 // TODO: Check magic timeout variable(3s)

export default class WordPressPostSaveControl extends React.Component {
  state = {
    saving: false,
    status: ''
  }
  timer = 0

  componentDidMount () {
    /*
    this.props.api.reply('wordpress:data:saved', (data) => {
      let status = data.status === 'success' ? 'success' : 'error'
      this.setState({
        saving: false,
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
    })

    this.props.api.reply('wordpress:data:saving', (options) => {
      this.clickSaveData({ options: options })
    })
    */
  }

  clearTimer () {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
  }

  clickSaveData = (e) => {
    e && e.preventDefault && e.preventDefault()
    if (vcCake.getData('lockActivity')) {
      window.alert('Please complete your activity and then click save!')
      return
    }
    if (this.state.saving) {
      return
    }
    this.setState({
      saving: true,
      status: ''
    })
    // Check Save option from other modules
    this.props.api.request('wordpress:save', {
      options: e ? e.options : {}
    })
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
