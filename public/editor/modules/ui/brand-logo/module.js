/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
require('./css/module.less')

vcCake.add('ui-brand-logo', function (api) {
  var React = require('react')
  var Control = React.createClass({
    render: function () {
      // TODO: Make correct link&target http://alpha.visualcomposer.io/wp-admin/?amputm_medium=frontend_editor
      return <a className="vcv-ui-navbar-logo" title="Visual Composer"
        href="#">
        <span className="vcv-ui-navbar-logo-title">Visual Composer</span>
      </a>
    }
  })
  api.module('ui-navbar').do('addElement', 'Get link', Control)
})
