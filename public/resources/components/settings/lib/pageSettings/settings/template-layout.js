import React from 'react'
import { setData, getStorage, env } from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class TemplateLayout extends React.Component {

  constructor (props) {
    super(props)
    // let templateStorageData = settingsStorage.state('pageTemplate').get()
    // let templateData = window.VCV_PAGE_TEMPLATES && window.VCV_PAGE_TEMPLATES() || {}
    // let currentTemplate = templateStorageData || templateData.current || 'default'
    // this.state = {
    //   current: currentTemplate,
    //   all: templateData.all || []
    // }
    // setData('ui:settings:pageTemplate', currentTemplate)
    this.updateTemplate = this.updateTemplate.bind(this)
  }

  updateTemplate (event) {
    // setData('ui:settings:pageTemplate', event.target.value)
    // this.setState({
    //   current: event.target.value
    // })
  }

  render () {
    return (
      <div className='vcv-ui-form-group'>
        { JSON.stringify(window.VCV_PAGE_TEMPLATES_LAYOUTS ? window.VCV_PAGE_TEMPLATES_LAYOUTS() : null) }
      </div>
    )
  }
}
