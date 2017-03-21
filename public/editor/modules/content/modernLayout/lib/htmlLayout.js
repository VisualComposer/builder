import React from 'react'
import Element from './element'
import '../../../../../sources/less/content/layout/html-layout.less'
import RowPlaceholder from './helpers/rowPlaceholder/component'

class HtmlLayout extends React.Component {
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
        <RowPlaceholder api={this.props.api} />
      </div>
    )
  }
}
HtmlLayout.propTypes = {
  data: React.PropTypes.array.isRequired,
  api: React.PropTypes.object.isRequired
}

export default HtmlLayout
