import React from 'react'
import Attribute from '../attribute'
import { env, getService } from 'vc-cake'
import HFSDropdowns from './lib/HFSDropdowns'
import TemplateLayoutIcons from './lib/templateLayoutIcons'
import Tooltip from '../../../components/tooltip/tooltip'

const dataManager = getService('dataManager')

export default class PageSettingsLayouts extends Attribute {
  static defaultProps = {
    fieldType: 'pageSettingsLayouts'
  }

  render () {
    const content = []
    const editorType = dataManager.get('editorType')
    const allowedPostTypes = ['default', 'vcv_tutorials']
    const localizations = dataManager.get('localizations')
    const selectOrChangeTheLayoutOfThePage = localizations ? localizations.selectOrChangeTheLayoutOfThePage : 'Select or change the layout of the page, post, or custom post type.'

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
          <div className='vcv-ui-form-group-heading-wrapper' key={content.length}>
            <span className='vcv-ui-form-group-heading'>Page Layout</span>
            <Tooltip>
              {selectOrChangeTheLayoutOfThePage}
            </Tooltip>
          </div>
        )
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
