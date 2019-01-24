import React from 'react'
import { env } from 'vc-cake'
import TitleSettings from './settings/title'
import LayoutTemplates from './settings/layoutTemplates'
import TemplateLayoutSettings from './settings/templateLayout'

export default class PageSettings extends React.Component {
  render () {
    const content = []
    content.push(<TitleSettings key={content.length} />)

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
