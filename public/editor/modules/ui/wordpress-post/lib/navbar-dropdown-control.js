/*eslint jsx-quotes: ["error", "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-wordpress-post', function (api) {
  var React = require('react')
  var Control = React.createClass({
    render: function () {
      return <dl className="vc-ui-navbar-dropdown vc-ui-pull-end">
        <dt className="vc-ui-navbar-dropdown-trigger vc-ui-navbar-control" title="Menu">
          <span className="vc-ui-navbar-control-content"><i
            className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-mobile-menu"></i><span>Menu</span></span>
        </dt>
        <dd className="vc-ui-navbar-dropdown-content vc-ui-navbar-show-labels">
          <div className="vc-ui-navbar-controls-group">
            <a className="vc-ui-navbar-control" href="#" title="Save as draft"><span
              className="vc-ui-navbar-control-content">Save as draft</span></a>
            <a className="vc-ui-navbar-control" href="#" title="View page"><span
              className="vc-ui-navbar-control-content">View page</span></a>
            <a className="vc-ui-navbar-control" href="#" title="Backend editor"><span
              className="vc-ui-navbar-control-content">Backend editor</span></a>
            <a className="vc-ui-navbar-control" href="#" title="WPB Dashboard"><span
              className="vc-ui-navbar-control-content">WPB Dashboard</span></a>
            <a className="vc-ui-navbar-control" href="#" title="WordPress Admin"><span
              className="vc-ui-navbar-control-content">WordPress Admin</span></a>
          </div>
        </dd>
      </dl>
    }
  })
  api.module('ui-navbar').do('addElement', 'Manage post version', Control, 'right')
})
