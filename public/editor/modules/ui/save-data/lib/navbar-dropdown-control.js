/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
// var PerfectScrollbar = require('perfect-scrollbar')
// var ReactDOM = require('react-dom')
vcCake.add('ui-navbar-dropdown-controls', function (api) {
  var React = require('react')
  var Control = React.createClass({
    componentDidMount: function () {
      // this.refs.scrollable && PerfectScrollbar.initialize(ReactDOM.findDOMNode(this.refs.scrollable))
    },
    render: function () {
      return <dl className="vcv-ui-navbar-dropdown vcv-ui-pull-end" disabled>
        <dt className="vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control" title="Menu">
          <span className="vcv-ui-navbar-control-content"><i
            className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-menu"></i><span>Menu</span></span>
        </dt>
        <dd ref="scrollable" className="vcv-ui-navbar-dropdown-content vcv-ui-navbar-show-labels">
          <div className="vcv-ui-navbar-controls-group">
            <a className="vcv-ui-navbar-control vcv-ui-state--active" href="#" title="Save as draft"><span
              className="vcv-ui-navbar-control-content">Save as draft</span></a>
            <a className="vcv-ui-navbar-control" href="#" title="View page"><span
              className="vcv-ui-navbar-control-content">View page</span></a>
            <a className="vcv-ui-navbar-control" href="#" title="Backend editor"><span
              className="vcv-ui-navbar-control-content">Backend editor</span></a>
            <a className="vcv-ui-navbar-control" href="#" title="WPB Dashboard"><span
              className="vcv-ui-navbar-control-content">WPB Dashboard</span></a>
            <a className="vcv-ui-navbar-control" href="#" title="WordPress Admin"><span
              className="vcv-ui-navbar-control-content">WordPress Admin</span></a>
          </div>
          <span className="vcv-ui-navbar-control-separator vcv-ui-pull-end"></span>
          <div className="vcv-ui-navbar-controls-group">
            <a className="vcv-ui-navbar-control" href="#" title="Undo" disabled="">
              <span className="vcv-ui-navbar-control-content">
                <i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-undo"></i>
                <span>Undo</span>
              </span>
            </a>
            <a className="vcv-ui-navbar-control" href="#" title="Redo" disabled="">
              <span className="vcv-ui-navbar-control-content">
                <i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-redo"></i>
                <span>Redo</span>
              </span>
            </a>
          </div>
        </dd>
      </dl>
    }
  })
  api.module('ui-navbar').do('addElement', 'Manage post version', Control, 'right')
})
