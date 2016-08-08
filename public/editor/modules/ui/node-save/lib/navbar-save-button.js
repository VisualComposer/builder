import React from 'react'
import classNames from 'classnames'

class SaveButtonControl extends React.Component {
  state = {
    saving: false,
    saved: false
  }

  clickSaveData = () => {
    this.setState({ 'saving': true })
    setTimeout(() => {
      this.setState({ 'saving': false })
      this.setState({ 'saved': true })
      setTimeout(() => {
        this.setState({ 'saved': false })
      }, 1000)
    }, 500)

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
        <a className={saveButtonClasses} title='Save' onClick={this.clickSaveData}><span
          className='vcv-ui-navbar-control-content'>
          <i className={saveIconClasses}></i><span>Save</span>
        </span></a>
      </div>
    )
  }
}
SaveButtonControl.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default SaveButtonControl
