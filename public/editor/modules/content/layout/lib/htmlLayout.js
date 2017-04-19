import React from 'react'
import Element from './element'
import RowPlaceholder from './helpers/rowPlaceholder/component'
import BlankRowPlaceholder from '../../../../../resources/components/layoutHelpers/blankRowPlaceholder/component'
import vcCake from 'vc-cake'

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
    const rowPlaceholder = vcCake.env('FEATURE_BLANK_PAGE_PLACEHOLDER') ? <BlankRowPlaceholder api={this.props.api} /> : <RowPlaceholder api={this.props.api} />

    return (
      <div className='vcv-layouts-html' data-vcv-module='content-layout'>
        {elementsList}
        {rowPlaceholder}
      </div>
    )
  }
}
