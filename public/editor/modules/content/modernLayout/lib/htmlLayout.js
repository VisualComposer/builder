import React from 'react'
import Element from './element'
import BlankRowPlaceholder from '../../../../../resources/components/layoutHelpers/blankRowPlaceholder/component'
import PropTypes from 'prop-types'

export default class HtmlLayout extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired
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
