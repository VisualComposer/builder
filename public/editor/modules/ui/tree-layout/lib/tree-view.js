var vcCake = require('vc-cake');
var React = require( 'react' );
var classNames = require( 'classnames' );


var TreeLayout = require( './tree-layout' );
var TreeContent = require( './tree-content' );

require( '../css/tree-view/init.less' );

var treeViewContent = [];

var TreeView = React.createClass({
  getInitialState: function () {
    return {
      contentExpand: true,
      treeContentCount: 0
    }
  },
  componentDidMount: function () {

  },

  render: function () {
    var treeViewClasses = classNames( {
      "vc-ui-tree-view-container": true,
      "vc-ui-tree-view-o-content-expand": this.state.contentExpand
    } );
    return (
      <div id="vc-ui-tree-view-container">
        <div className={treeViewClasses}>
          <div className="vc-ui-tree-view-layout">
            <TreeLayout api={this.props.api}/>
          </div>
          <div className="vc-ui-tree-view-content">
            <TreeContent/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TreeView;