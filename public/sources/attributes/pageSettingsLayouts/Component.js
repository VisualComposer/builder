import React from 'react'
import Attribute from '../attribute'
import { env, getService } from 'vc-cake'
import HFSDropdowns from './lib/HFSDropdowns'
import TemplateLayoutIcons from './lib/templateLayoutIcons'

const dataManager = getService('dataManager')

export default class PageSettingsLayouts extends Attribute {
  static defaultProps = {
    fieldType: 'pageSettingsLayouts'
  }

  render () {
    const content = []
    const editorType = dataManager.get('editorType')
    const allowedPostTypes = ['default', 'vcv_archives', 'vcv_tutorials']

    if (allowedPostTypes.indexOf(editorType) > -1) {
      let addTemplateIcons = true
      if (
        this.props.options &&
        Object.prototype.hasOwnProperty.call(this.props.options, 'templateLayoutIcons') &&
        !this.props.options.templateLayoutIcons
      ) {
        addTemplateIcons = false
      }

      if (addTemplateIcons) {
        content.push(
          <TemplateLayoutIcons key={content.length} options={this.props.options || {}} />)
      }
    }
    if (env('VCV_JS_THEME_LAYOUTS')) {
      content.push(<HFSDropdowns key={content.length} options={this.props.options || {}} />)
    }

    return (
      <>
        {content}
      </>
    )
  }
}
