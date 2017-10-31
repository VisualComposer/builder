import React from 'react'
import {env} from 'vc-cake'
import TitleSettings from './settings/title'
import TemplateSettings from './settings/template'

export default class PageSettings extends React.Component {

  constructor (props) {
    super(props)
    let content = []
    if (env('PAGE_TITLE_FE')) {
      content.push(<TitleSettings key={content.length} />)
    }
    if (env('PAGE_TEMPLATES_FE')) {
      content.push(<TemplateSettings key={content.length} />)
    }
    this.state = {
      content
    }
  }

  render () {
    return (
      <div>
        {this.state.content}
      </div>
    )
  }
}
