import React from 'react'
import classNames from 'classnames'

export default class SettingsFooter extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      saved: false
    }
  }

  onSave = () => {
    /*
    let { api } = this.props
    api.request('settings:update', {
      customStyles: {
        global: getData('ui:settings:customStyles:global'),
        local: getData('ui:settings:customStyles:local')
      }
    })
    */
    this.effect()
  }
  componentDidMount () {
    this.canceled = false
  }
  componentWillUnmount () {
    this.canceled = true
  }
  effect () {
    this.setState({ 'saving': true })
    setTimeout(() => {
      this.setState({ 'saving': false })
      this.setState({ 'saved': true })
      setTimeout(() => {
        !this.canceled && this.setState({ 'saved': false })
      }, 1000)
    }, 500)
  }

  render () {
    let saveButtonClasses = classNames({
      'vcv-ui-settings-action': true,
      'vcv-ui-state--success': this.state.saved
    })
    let saveIconClasses = classNames({
      'vcv-ui-settings-action-icon': true,
      'vcv-ui-wp-spinner': this.state.saving,
      'vcv-ui-icon': !this.state.saving,
      'vcv-ui-icon-save': !this.state.saving
    })

    return (
      <div className='vcv-ui-settings-content-footer'>
        <div className='vcv-ui-settings-actions'>
          <a className={saveButtonClasses} title='Save' onClick={this.onSave}>
            <span className='vcv-ui-settings-action-content'>
              <i className={saveIconClasses} />
              <span>Save</span>
            </span>
          </a>
        </div>
      </div>
    )
  }
}

