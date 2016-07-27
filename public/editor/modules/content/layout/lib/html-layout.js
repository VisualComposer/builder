import React from 'react'
import HtmlElement from './element'
import '../css/html-layout.less'

class HtmlLayout extends React.Component {
  render () {
    let elementsList
    if (this.props.data) {
      elementsList = this.props.data.map(function (element) {
        return <HtmlElement element={element} key={element.id} api={this.props.api} />
      }, this)
    }
    return (<div className='vcv-layouts-html' data-vcv-module='content-layout'>
      {elementsList}
    </div>)
  }
}

module.exports = HtmlLayout
