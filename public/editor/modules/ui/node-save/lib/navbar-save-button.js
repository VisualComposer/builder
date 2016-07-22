/*eslint no-extra-bind: "off"*/

import React from 'react'
import classNames from 'classnames'

class Control extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      saved: false
    }
  }

  clickSaveData () {
    let _this = this
    this.setState({ 'saving': true })
    setTimeout(() => {
      _this.setState({ 'saving': false })
      _this.setState({ 'saved': true })
    }, 500)
    setTimeout(() => {
      _this.setState({ 'saved': false })
    }, 5000)
    this.props.api.request('node:save')
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

    return (
      <div className='vcv-ui-navbar-controls-group vcv-ui-pull-end'>
        <a className={saveButtonClasses} title='Save' onClick={this.clickSaveData.bind(this)}><span
          className='vcv-ui-navbar-control-content'>
          <i className={saveIconClasses}></i><span>Save</span>
        </span></a>
      </div>
    )
  }
}
Control.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = Control
