import React from 'react'
import {env} from 'vc-cake'
import TitleSettings from './settings/title'
import TemplateSettings from './settings/template'
import LayoutSettings from './settings/layout'

export default class PageSettings extends React.Component {
  render () {
    const content = []
    if (env('PAGE_TITLE_FE')) {
      content.push(<TitleSettings key={content.length} />)
    }
    if (env('PAGE_TEMPLATES_FE') && !env('THEME_EDITOR')) {
      content.push(<TemplateSettings key={content.length} />)
    }
    if (env('THEME_LAYOUTS')) {
      content.push(<LayoutSettings key={content.length} />)
    }
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    )
  }
}
