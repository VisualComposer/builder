import React from 'react'
var BarContent = React.createClass({
  propTypes: {
    api: React.PropTypes.object.isRequired
  },
  render: function () {
    let BarContentStart = require('./content-start')
    let BarContentEnd = require('./content-end')
    return (
      <div className='vcv-layout-bar-content vcv-layout-bar-content--visible'>
        <BarContentStart api={this.props.api} />
        <BarContentEnd api={this.props.api} />
      </div>
    )
  }
})
module.exports = BarContent
