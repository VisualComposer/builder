var vcCake = require('vc-cake');
vcCake.add('ui-tree-layout', function(api){
  var React = require('react');
  var classNames = require('classnames');
  var Control = React.createClass({
    getInitialState: function() {
      return {
        menuExpand: false,
        data: [],
      };
    },
    componentDidMount: function () {
      var document = vcCake.getService('document');
    },
    toggleTreeView: function() {
      this.setState({menuExpand: !this.state.menuExpand});
      api.notify('toggle');
    },
    render: function(){
      let controlClass = classNames({
        'vc-ui-navbar-control': true,
        'vc-ui-navbar-control-active': this.state.menuExpand
      });
      return <a className={controlClass} href="#" title="Tree View" onClick={this.toggleTreeView}><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-layers"></i><span>Tree View</span></span></a>;
    }
  });
  api.module('ui-navbar').do('addElement', 'Tree layout', Control, 'left');
});

