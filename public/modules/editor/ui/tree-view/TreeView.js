var React = require( 'react' );
var Mediator = require( '../../../../helpers/Mediator' ); // need to remove too
var classNames = require( 'classnames' );


var TreeLayout = require( '../../layouts/tree/TreeLayout' );

require( './less/treeView/init.less' );

var TreeView = React.createClass( Mediator.installTo( {
  getInitialState: function () {
    return {
      contentExpand: false
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
          <TreeLayout/>
        </div>
        <div className="vc-ui-tree-view-content">
          <p>
            <i className="vc-ui-icon vc-ui-icon-bug" style={{fontSize: '3em'}}></i> right side content
          </p>
        </div>
      </div>
    </div>
    );
  }
} ) );

module.exports = TreeView;