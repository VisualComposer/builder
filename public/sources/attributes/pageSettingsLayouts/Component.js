import React from 'react'
import Attribute from '../attribute'
import { env } from 'vc-cake'
import HFSDropdowns from './lib/HFSDropdowns'
import TemplateLayoutIcons from './lib/templateLayoutIcons'

export default class PageSettingsLayouts extends Attribute {
  static defaultProps = {
    fieldType: 'pageSettingsLayouts'
  }

  render () {
    const content = []

    if (typeof window.VCV_EDITOR_TYPE === 'undefined' || window.VCV_EDITOR_TYPE() === 'archive') {
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
