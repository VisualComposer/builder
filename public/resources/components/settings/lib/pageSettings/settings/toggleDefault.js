import React from 'react'
import {setData, getStorage, env} from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class ToggleDefault extends React.Component {

  constructor (props) {
    super(props)
    this.hfsType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : null
    let value = settingsStorage.state(`${this.hfsType}Default`).get() || false
    this.state = {
      default: value
    }
    setData(`ui:settings:${this.hfsType}Default`, this.state.default)
    this.updateToggle = this.updateToggle.bind(this)
  }

  updateToggle (event) {
    setData(`ui:settings:${this.hfsType}Default`, event.target.checked)
    this.setState({
      default: event.target.checked
    })
  }

  render () {
    if (!env('THEME_EDITOR')) {
      return null
    }
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const setDefault = localizations ? localizations.setDefault : 'Set default'

    let checked = (this.state.default) ? 'checked' : ''

    return (
      <div>
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
            <div className='vcv-ui-form-switch-container'>
              <label className='vcv-ui-form-switch'>
                <input type='checkbox' onChange={this.updateToggle} id='vcv-page-title-disable' checked={checked} />
                <span className='vcv-ui-form-switch-indicator' />
                <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
                <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
              </label>
              <label htmlFor='vcv-page-title-disable'
                className='vcv-ui-form-switch-trigger-label'>{setDefault}</label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
