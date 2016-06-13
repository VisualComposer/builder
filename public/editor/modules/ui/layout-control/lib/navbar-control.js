/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
var PerfectScrollbar = require('perfect-scrollbar')
var ReactDOM = require('react-dom')
vcCake.add('ui-layout-control', function (api) {
  var React = require('react')
  var Control = React.createClass({
    componentDidMount: function () {
      this.refs.scrollable && PerfectScrollbar.initialize(ReactDOM.findDOMNode(this.refs.scrollable))
    },
    render: function () {
      return <dl className="vcv-ui-navbar-dropdown vcv-ui-navbar-dropdown-linear vcv-ui-navbar-hidden-sm vcv-ui-pull-end" disabled>
        <dt className="vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control" title="Desktop">
          <span className="vcv-ui-navbar-control-content">
            <i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-desktop"></i><span>Desktop control</span>
          </span>
        </dt>
        <dd ref="scrollable" className="vcv-ui-navbar-dropdown-content">
          <div className="vcv-ui-navbar-controls-group">
            <a className="vcv-ui-navbar-control" href="#" title="Desktop"><span className="vcv-ui-navbar-control-content"><i
              className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-desktop"></i><span>Desktop</span></span></a>
            <a className="vcv-ui-navbar-control" href="#" title="Tablet Landscape"><span
              className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-tablet-landscape"></i><span>Tablet Landscape</span></span></a>
            <a className="vcv-ui-navbar-control" href="#" title="Tablet Portrait"><span
              className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-tablet-portrait"></i><span>Tablet Portrait</span></span></a>
            <a className="vcv-ui-navbar-control" href="#" title="Mobile Landscape"><span
              className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-landscape"></i><span>Mobile Landscape</span></span></a>
            <a className="vcv-ui-navbar-control" href="#" title="Mobile Portrait"><span
              className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-portrait"></i><span>Mobile Portrait</span></span></a>
          </div>
        </dd>
      </dl>
    }
  })
  api.module('ui-navbar').do('addElement', 'Layout control', Control)
})
