/*eslint no-extra-bind: "off"*/

import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
let PostData = vcCake.getService('wordpress-post-data')

class WordPressPostSaveControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      saved: false
    }
  }

  clickSaveData () {
    this.setState({ 'saving': true })
    setTimeout(
      (() => {
        this.setState({ 'saving': false })
        this.setState({ 'saved': true })
      }).bind(this),
      500
    )
    setTimeout(
      (() => {
        this.setState({ 'saved': false })
      }).bind(this),
      5000
    )
    this.props.api.request('wordpress:save')
  }

  render () {
    let saveButtonClasses = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--success': this.state.saved
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
        <a className={saveButtonClasses} title={saveText} onClick={this.clickSaveData.bind(this)}><span
          className='vcv-ui-navbar-control-content'>
          <i className={saveIconClasses}></i><span>{saveText}</span>
        </span></a>
      </div>
    )
  }
}
WordPressPostSaveControl.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = WordPressPostSaveControl
