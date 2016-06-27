import React from 'react'
var BarContent = React.createClass({
  render: function () {
    let BarContentStart = require('./content-start')
    let BarContentEnd = require('./content-end')
    return (
      <div className='vcv-layout-bar-content vcv-layout-bar-content--visible'>
        <BarContentStart />
        <BarContentEnd />
      </div>
    )
  }
})
module.exports = BarContent
