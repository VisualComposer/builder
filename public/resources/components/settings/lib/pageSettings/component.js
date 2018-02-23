import React from 'react'
import { env } from 'vc-cake'
import TitleSettings from './settings/title'
import DeprecatedTemplateSettings from './settings/deprecated/template'
import DeprecatedLayoutSettings from './settings/deprecated/layout'
import LayoutTemplates from './settings/layoutTemplates'
import TemplateLayoutSettings from './settings/templateLayout'

export default class PageSettings extends React.Component {
  render () {
    const content = []
    if (env('PAGE_TITLE_FE')) {
      content.push(<TitleSettings key={content.length} />)
    }
    if (!env('PAGE_TEMPLATE_LAYOUTS')) {
      if (env('PAGE_TEMPLATES_FE') && !env('THEME_EDITOR')) {
        content.push(<DeprecatedTemplateSettings key={content.length} />)
      }
      if (env('THEME_LAYOUTS')) {
        content.push(<DeprecatedLayoutSettings key={content.length} />)
      }
    } else {
      if (!env('THEME_EDITOR')) {
        content.push(<TemplateLayoutSettings key={content.length} />)
      }
      if (env('THEME_LAYOUTS')) {
        content.push(<LayoutTemplates key={content.length} />)
      }
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    )
  }
}
