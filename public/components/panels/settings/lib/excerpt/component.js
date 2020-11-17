import React from 'react'
import { getStorage, getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const settingsStorage = getStorage('settings')

export default class Excerpt extends React.Component {
  constructor (props) {
    super(props)
    const current = settingsStorage.state('excerpt').get() || dataManager.get('excerpt') || ''

    this.state = {
      current: current
    }

    settingsStorage.state('excerpt').set(current)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
  }

  handleChangeTitle (event) {
    const newValue = event.target.value
    this.setState({
      current: newValue
    })
    settingsStorage.state('excerpt').set(newValue)
  }

  render () {
    const settingName = localizations ? localizations.excerpt : 'Excerpt'
    const excerptsAreOptional = localizations ? localizations.excerptsAreOptional : 'Excerpts are optional hand-crafted summaries of your content that can be used in your theme. Learn more about manual excerpts.'

    return (
      <>
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <span className='vcv-ui-form-group-heading'>{settingName}</span>
          <textarea className='vcv-ui-form-input' value={this.state.current} onChange={this.handleChangeTitle} onBlur={this.handleBlur} />
          <p className='vcv-ui-form-helper'>{excerptsAreOptional}</p>
        </div>
      </>
    )
  }
}
