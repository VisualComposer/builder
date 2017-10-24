import React from 'react'
import {setData, getStorage} from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class SettingsSection extends React.Component {

  constructor (props) {
    super(props)
    let data = window.VCV_PAGE_TEMPLATES()
    this.state = {
      current: settingsStorage.state('pageTemplate').get() || data.current,
      all: data.all
    }
    setData('ui:settings:pageTemplate', this.state.current)
    this.updateTemplate = this.updateTemplate.bind(this)
    this.getOptions = this.getOptions.bind(this)
  }

  updateTemplate (event) {
    setData('ui:settings:pageTemplate', event.target.value)
    this.setState({ current: event.target.value })
  }

  getOptions () {
    let options = []
    for (let item in this.state.all) {
      options.push(<option key={this.state.all[ item ]} value={this.state.all[ item ]}>{item}</option>)
    }
    return options
  }

  render () {
    return (
      <div>
        <span className='vcv-ui-form-group-heading'>Template</span>
        <select className='vcv-ui-form-dropdown' value={this.state.current} onChange={this.updateTemplate}>
          <option key='default' value='default'>Default template</option>
          {this.getOptions()}
        </select>
      </div>
    )
  }
}
