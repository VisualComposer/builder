var vcCake = require('vc-cake');
vcCake.add('ui-tree-layout', function(api){
  var Layout = require('./layout');
  var React = require('react');
  var classNames = require('classnames');
  var Control = React.createClass({
    getInitialState: function() {
      return {
        menuExpand: false
      };
    },
    clickMenuExpand: function () {
      this.setState({menuExpand: !this.state.menuExpand});
    },
    render: function(){
      return <dl className="vc-ui-navbar-dropdown">
        <dt className="vc-ui-navbar-dropdown-trigger vc-ui-navbar-control" title="Tree View">
          <span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-layers"></i><span>Tree View</span></span>
        </dt>
        <dd className="vc-ui-navbar-dropdown-content vc-ui-navbar-show-labels">
          <Layout/>
        </dd>
      </dl>;
    }
  });
  api.module('ui-navbar').do('addElement', 'Tree layout', Control, 'left');
});

