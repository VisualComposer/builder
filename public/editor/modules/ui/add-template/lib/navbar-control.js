/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-add-template', function (api) {
  var React = require('react')
  var Control = React.createClass({
    handleClick: function (e) {
      e && e.preventDefault()
    },
    render: function () {
      return (<a className="vcv-ui-navbar-control" onClick={this.handleClick} disabled title="Template"><span className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-template"></i><span>Template</span></span></a>
      )
    }
  })
  api.module('ui-navbar').do('addElement', 'Add template', Control, 'left')
})
