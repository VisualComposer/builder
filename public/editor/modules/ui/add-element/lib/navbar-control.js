/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-add-element', function (api) {
  var React = require('react')
  var Control = React.createClass({
    handleClick: function (e) {
      e && e.preventDefault()
      api.notify('show', false)
    },
    render: function () {
      return <a className="vcv-ui-navbar-control" href="#" title="Add Element" onClick={this.handleClick}>
        <span className="vcv-ui-navbar-control-content">
          <i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add"></i>
          <span>Add Element</span>
        </span>
      </a>
    }
  })
  api.module('ui-navbar').do('addElement', 'Add element', Control, 'left')
})
