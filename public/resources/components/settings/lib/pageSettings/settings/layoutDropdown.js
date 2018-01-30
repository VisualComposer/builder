import React from 'react'
import {setData, getStorage} from 'vc-cake'
import PropTypes from 'prop-types'

const settingsStorage = getStorage('settings')

export default class LayoutDropdown extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    layoutName: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    const layoutName = props.layoutName.toLowerCase()
    const currentLayout = settingsStorage.state(`${layoutName}Template`).get()

    this.state = {
      current: currentLayout
    }

    setData(`ui:settings:${layoutName}Template`, currentLayout)

    this.updateLayout = this.updateLayout.bind(this)
    this.getTemplateOptions = this.getTemplateOptions.bind(this)
  }

  updateLayout (event) {
    const layoutName = this.props.layoutName.toLowerCase()
    setData(`ui:settings:${layoutName}Template`, event.target.value)
    this.setState({
      current: event.target.value
    })
  }

  getTemplateOptions () {
    const { data } = this.props
    return Object.keys(data).map((key, index) => (
      <option key={index} value={data[ key ]}>{key}</option>
    ))
  }

  render () {
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>{this.props.layoutName}</span>
        <select className='vcv-ui-form-dropdown' value={this.state.current} onChange={this.updateLayout}>
          {this.getTemplateOptions()}
        </select>
      </div>
    )
  }
}
