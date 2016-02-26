var vcCake = require('vc-cake');
vcCake.add('ui-tree-layout', function(api){
  var Layout = require('./layout');
  var React = require('react');
  var classNames = require('classnames');
  var Control = React.createClass({
    getInitialState: function() {
      return {
        menuExpand: false,
        data: [],
        treeBuild: false,
      };
    },
    enableTree: function () {
      if(false === this.state.treeBuild) {
        var document = vcCake.getService('document');
        api.reply('data:changed', function(data) {
          this.setState({data: data});
        }.bind(this));

        this.setState({
          data: document.children(false), 
          treeBuild: true
        });
      }
    },
    render: function(){
      return <dl className="vc-ui-navbar-dropdown" onMouseOver={this.enableTree}>
        <dt className="vc-ui-navbar-dropdown-trigger vc-ui-navbar-control" title="Tree View">
          <span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-layers"></i><span>Tree View</span></span>
        </dt>
        <dd className="vc-ui-navbar-dropdown-content vc-ui-navbar-show-labels">
          <Layout data={this.state.data}/>
        </dd>
      </dl>;
    }
  });
  api.module('ui-navbar').do('addElement', 'Tree layout', Control, 'left');
});

