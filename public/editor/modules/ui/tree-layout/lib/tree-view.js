var vcCake = require('vc-cake');
var React = require( 'react' );
var classNames = require( 'classnames' );


var TreeLayout = require( './tree-layout' );
var EditElement = require( './edit-element/index' );

require( '../css/tree-view/init.less' );

var TreeView = React.createClass({
  getInitialState: function () {
    return {
      treeContentCount: 0,
      elementId: false
    }
  },
  componentDidMount: function () {
    this.props.api.reply('app:edit', function(id){
      this.setState({elementId: id});
    }.bind(this));
    this.props.api.on('edit:close', function(elementId){
      this.setState({elementId: elementId});
    }.bind(this));
  },

  render: function () {
    var treeViewClasses = classNames( {
      "vc-ui-tree-view-container": true,
      "vc-ui-tree-view-o-content-expand": false !== this.state.elementId
    } );
    return (
      <div id="vc-ui-tree-view-container">
        <div className={treeViewClasses}>
          <div className="vc-ui-tree-view-layout">
            <TreeLayout api={this.props.api}/>
          </div>
          <div className="vc-ui-tree-view-content">
            <EditElement elementId={this.state.elementId} api={this.props.api}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TreeView;