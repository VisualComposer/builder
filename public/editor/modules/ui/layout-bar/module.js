import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import BarContent from './lib/content'
import BarHeader from './lib/header'

vcCake.add('ui-layout-bar', function (api) {
  class LayoutBar extends React.Component {
    render () {
      return (
        <div className='vcv-layout-bar'>
          <BarHeader api={api} />
          <BarContent api={api} />
        </div>
      )
    }
  }
  module.exports = (LayoutBar)

  let layoutHeader = document.querySelector('#vcv-layout-header')
  ReactDOM.render(
    <LayoutBar />,
    layoutHeader
  )
})
