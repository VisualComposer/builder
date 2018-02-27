import React from 'react'
import Element from './element'
import BlankRowPlaceholder from 'public/resources/components/layoutHelpers/blankRowPlaceholder/component'
import PropTypes from 'prop-types'

export default class HtmlLayout extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired
  }

  render () {
    const editorType = window.VCV_EDITOR_TYPE && window.VCV_EDITOR_TYPE() || 'default'
    const layoutsContent = []
    let elementsList
    if (this.props.data) {
      elementsList = this.props.data.map((element) => {
        return (
          <Element element={element} key={element.id} api={this.props.api} />
        )
      })
    }

    layoutsContent.push(elementsList)
    if (editorType === 'footer') {
      layoutsContent.unshift(<BlankRowPlaceholder api={this.props.api} key='blank-row-placeholder' />)
    } else {
      layoutsContent.push(<BlankRowPlaceholder api={this.props.api} key='blank-row-placeholder' />)
    }

    return (
      <div className='vcv-layouts-html' data-vcv-module='content-layout'>
        {layoutsContent}
      </div>
    )
  }
}
