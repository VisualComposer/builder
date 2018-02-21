import React from 'react'
import {setData, getStorage} from 'vc-cake'

const settingsStorage = getStorage('settings')
const vcLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()
const themeTemplates = window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME && window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME()

export default class TemplateLayout extends React.Component {

  constructor (props) {
    super(props)
    let templateStorageData = settingsStorage.state('pageTemplate').get()
    let templateData = window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT() || {
      type: 'theme', value: 'default'
    }
    let currentTemplate = templateStorageData || templateData
    let showTheme = false
    if (currentTemplate.type === 'theme' || (currentTemplate.type === 'vc' && currentTemplate.value === 'default')) {
      showTheme = true
    }
    this.state = {
      current: currentTemplate,
      showTheme
    }
    setData('ui:settings:pageTemplate', currentTemplate)
    this.allowedTypes = [ 'vc', 'vc-theme', 'theme' ]
    this.updateTemplate = this.updateTemplate.bind(this)
  }

  updateTemplate (event) {
    let showTheme = false
    let layoutData = event.target && event.target.value && event.target.value.split('__')
    let data = {
      type: layoutData[ 0 ],
      value: layoutData[ 1 ]
    }

    if (data.type === 'theme' || (data.type === 'vc' && data.value === 'default')) {
      showTheme = true
    }

    setData('ui:settings:pageTemplate', data)
    this.setState({
      current: data,
      showTheme
    })
  }

  getTemplateOptions () {
    let optGroups = []
    if (vcLayouts && vcLayouts.length) {
      vcLayouts.forEach((templateList, index) => {
        if (this.allowedTypes.indexOf(templateList.type) < 0) {
          return
        }
        let group = []
        templateList.values.forEach((template, tIndex) => {
          group.push(
            <option value={`${templateList.type}__${template.value}`}
              key={`template-opt-group-vc-${index}-opt-${tIndex}`}>
              {template.label}
            </option>
          )
        })
        group.length && optGroups.push(
          <optgroup label={templateList.title} key={`template-opt-group-vc-${index}`}>
            {group}
          </optgroup>
        )
      })
    }

    optGroups.push(<option key='default' value='theme__default'>Theme Default</option>)

    return (
      <React.Fragment>
        {optGroups}
      </React.Fragment>
    )
  }

  getThemeTemplateDropdown () {
    if (!this.state.showTheme || !themeTemplates) {
      return ''
    }
    let options = []
    if (themeTemplates) {
      themeTemplates.forEach((templateList, index) => {
        if (this.allowedTypes.indexOf(templateList.type) < 0) {
          return
        }
        templateList.values.forEach((template, tIndex) => {
          options.push(
            <option value={`${templateList.type}__${template.value}`}
              key={`template-opt-group-theme-${index}-opt-${tIndex}`}>
              {template.label}
            </option>
          )
        })
      })
    }

    return (
      <div className='vcv-ui-form-group'>
        <select className='vcv-ui-form-dropdown' value={`${this.state.current.type}__${this.state.current.value}`} onChange={this.updateTemplate}>
          {options}
        </select>
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        <div className='vcv-ui-form-group'>
          <select className='vcv-ui-form-dropdown' value={`${this.state.current.type}__${this.state.current.value}`} onChange={this.updateTemplate}>
            {this.getTemplateOptions()}
          </select>
        </div>
        {this.getThemeTemplateDropdown()}
      </React.Fragment>
    )
  }
}
