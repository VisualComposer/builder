var vcCake = require('vc-cake');
require('./lib/navbar-control');
vcCake.add('ui-tree-layout', function(api){
  var React = require('react');
  var ReactDOM = require('react-dom');
  var TreeView = require('./lib/tree-view');
  var Component = React.createClass({
    getInitialState: function() {
      return {
        treeViewExpand: false
      };
    },
    componentDidMount: function() {
      api.on('toggle', function(){
        this.setState(function(prevState) {
          return { treeViewExpand: !prevState.treeViewExpand };
        });
      }.bind(this));
    },
    render: function() {
      return <div style={this.state.treeViewExpand ? {opacity: 1, visibility: 'visible'} : {opacity: 0, visibility: 'hidden'}}>
        <TreeView api={api}/>
      </div>;
    }
  });
  // Here comes wrapper for navbar
  var wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'vc-ui-tree-layout-wrapper');
  document.getElementById('vc-editor-container').appendChild(wrapper);
  ReactDOM.render(
    <Component/>,
    wrapper
  );
});

