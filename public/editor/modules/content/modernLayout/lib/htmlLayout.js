import React from 'react'
import Element from './element'
import BlankRowPlaceholder from '../../../../../resources/components/layoutHelpers/blankRowPlaceholder/component'

export default class HtmlLayout extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    api: React.PropTypes.object.isRequired
  }

  render () {
    let elementsList
    if (this.props.data) {
      elementsList = this.props.data.map((element) => {
        return (
          <Element element={element} key={element.id} api={this.props.api} />
        )
      })
    }
    return (
      <div className='vcv-layouts-html' data-vcv-module='content-layout'>
        {elementsList}
        <BlankRowPlaceholder api={this.props.api} />
      </div>
    )
  }
}
