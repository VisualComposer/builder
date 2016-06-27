import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
vcCake.add('ui-layout-bar', function (api) {
  let BarContent = require('./lib/content')
  let LayoutBar = React.createClass({
    render: function () {
      return (
        <div className='vcv-layout-bar'>
          <div className='vcv-layout-bar-header' id='vcv-editor-header'>

          </div>
          <BarContent />
        </div>
      )
    }
  })
  module.exports = (LayoutBar)

// Here comes wrapper for navbar
  let layoutHeader = document.querySelector('#vcv-layout-header')
  ReactDOM.render(
    <LayoutBar />,
    layoutHeader
  )
})
