/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-layout-control', function (api) {
  var React = require('react')
  var Control = React.createClass({
    render: function () {
      return <a className="vcv-ui-navbar-control vcv-ui-pull-end" href="#" title="Settings" disabled>
        <span className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-cog"></i><span>Settings</span></span></a>
    }
  })
  api.module('ui-navbar').do('addElement', 'Settings', Control)
})
