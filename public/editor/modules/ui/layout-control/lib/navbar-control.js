/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-layout-control', function (api) {
  var React = require('react')
  var Control = React.createClass({
    render: function () {
      return <dl className="vc-ui-navbar-dropdown vc-ui-navbar-dropdown-linear vc-ui-navbar-hidden-sm vc-ui-pull-end" disabled>
        <dt className="vc-ui-navbar-dropdown-trigger vc-ui-navbar-control" disabled title="Desktop">
          <span className="vc-ui-navbar-control-content">

            <i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-desktop"></i><span>Desktop control</span>
          </span>
        </dt>
        <dd className="vc-ui-navbar-dropdown-content">
          <div className="vc-ui-navbar-controls-group">
            <a className="vc-ui-navbar-control" href="#" title="Desktop"><span className="vc-ui-navbar-control-content"><i
              className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-desktop"></i><span>Desktop</span></span></a>
            <a className="vc-ui-navbar-control" href="#" title="Tablet Landscape"><span
              className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-tablet-landscape"></i><span>Tablet Landscape</span></span></a>
            <a className="vc-ui-navbar-control" href="#" title="Tablet Portrait"><span
              className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-tablet-portrait"></i><span>Tablet Portrait</span></span></a>
            <a className="vc-ui-navbar-control" href="#" title="Mobile Landscape"><span
              className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-mobile-landscape"></i><span>Mobile Landscape</span></span></a>
            <a className="vc-ui-navbar-control" href="#" title="Mobile Portrait"><span
              className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-mobile-portrait"></i><span>Mobile Portrait</span></span></a>
          </div>
        </dd>
      </dl>
    }
  })
  api.module('ui-navbar').do('addElement', 'Layout control', Control)
})
