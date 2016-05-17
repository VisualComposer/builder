/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-layout-control', function (api) {
  var React = require('react')
  var Control = React.createClass({
    render: function () {
      return <a className="vc-ui-navbar-control vc-ui-badge-warning vc-ui-pull-end" href="#" title="Settings"><span
        className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-cog"></i><span>Settings</span></span></a>
    }
  })
  api.module('ui-navbar').do('addElement', 'Settings', Control)
})
