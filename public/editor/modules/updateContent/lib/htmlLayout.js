import React from 'react'
import Element from '../../layout/lib/element'
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
          <Element id={element.id} key={element.id} api={this.props.api} />
        )
      })
    }
    return (
      <div className='vcv-layouts-html' data-vcv-module='content-layout'>
        {elementsList}
      </div>
    )
  }
}
