import React from 'react'
import { env } from 'vc-cake'
import TitleSettings from './settings/title'
import LayoutTemplates from './settings/layoutTemplates'
import TemplateLayoutSettings from './settings/templateLayout'
import Permalink from 'public/components/permalink/permalink'
import PreviewToggle from './settings/previewToggle'

const localizations = window.VCV_I18N && window.VCV_I18N()
const editorSettingsText = localizations ? localizations.editorSettings : 'Editor Settings'

export default class PageSettings extends React.Component {
  render () {
    const content = []
    content.push(<TitleSettings key={content.length} />)

    if (!env('VCV_JS_THEME_EDITOR')) {
      content.push(<div className='vcv-ui-form-group vcv-ui-form-group-style--inline vcv-ui-form-group--permalink' key={content.length}>
        <Permalink />
      </div>)
    }

    if (!env('VCV_JS_THEME_EDITOR')) {
      content.push(<TemplateLayoutSettings key={content.length} />)
    }
    if (env('VCV_JS_THEME_LAYOUTS')) {
      content.push(<LayoutTemplates key={content.length} />)
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    )
  }
}
