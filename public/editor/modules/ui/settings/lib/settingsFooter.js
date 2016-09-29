import React from 'react'
import classNames from 'classnames'
import {getData} from 'vc-cake'

export default class SettingsFooter extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      saved: false
    }
  }

  onSave = () => {
    let { api } = this.props
    api.request('settings:update', {
      customStyles: {
        global: getData('ui:settings:customStyles:global'),
        local: getData('ui:settings:customStyles:local')
      }
    })
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
      'vcv-ui-tree-layout-action': true,
      'vcv-ui-state--success': this.state.saved
    })
    let saveIconClasses = classNames({
      'vcv-ui-tree-layout-action-icon': true,
      'vcv-ui-wp-spinner': this.state.saving,
      'vcv-ui-icon': !this.state.saving,
      'vcv-ui-icon-save': !this.state.saving
    })

    return (
      <div className='vcv-ui-tree-content-footer'>
        <div className='vcv-ui-tree-layout-actions'>
          <a className={saveButtonClasses} title='Save' onClick={this.onSave}>
            <span className='vcv-ui-tree-layout-action-content'>
              <i className={saveIconClasses} />
              <span>Save</span>
            </span>
          </a>
        </div>
      </div>
    )
  }
}

