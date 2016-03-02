var vcCake = require('vc-cake');
var React = require( 'react' );

var classNames = require( 'classnames' );

require( '../css/tree-view/init.less' );


var TreeContent = React.createClass({
  getInitialState: function () {
    return {
      treeContent: false
    }
  },
  componentDidMount: function () {

  },

  render: function () {
    var treeContentClasses = classNames( {
      "vc-ui-tree-content": true
    } );
    return (
      <div className={treeContentClasses}>
        <div className="vc-ui-tree-content-header">
          <div className="vc-ui-tree-content-title-bar">
            <i className="vc-ui-tree-content-title-icon vc-ui-icon vc-ui-icon-bug"></i>
            <h3 className="vc-ui-tree-content-title">
              Column Settings
            </h3>
            <nav className="vc-ui-tree-content-title-controls">
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug"><span className="vc-ui-tree-content-title-control-content"><i className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-document-alt-stroke"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug" disabled=""><span className="vc-ui-tree-content-title-control-content"><i className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-heart-stroke"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug"><span className="vc-ui-tree-content-title-control-content"><i className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-cog"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug"><span className="vc-ui-tree-content-title-control-content"><i className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-close"></i></span></a>
            </nav>
          </div>
        </div>

        <div className="vc-ui-tree-content-section">
          <div className="vc-ui-editor-tabs-container">
            <nav className="vc-ui-editor-tabs">

              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>General</span></span></a>

              <a className="vc-ui-editor-tab" href="#" disabled><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-redo"></i><span>Design Options</span></span></a>

              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>Advanced</span></span></a>
              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>Filter Options</span></span></a>
              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>Exposure Settings</span></span></a>
              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>More Options</span></span></a>
              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>Other Tab</span></span></a>
              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>One More Tab</span></span></a>
              <a className="vc-ui-editor-tab" href="#"><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i><span>JAT</span></span></a>

              <dl className="vc-ui-editor-tab-dropdown">
                <dt className="vc-ui-editor-tab-dropdown-trigger vc-ui-editor-tab-control" title="Menu">
                  <span className="vc-ui-editor-tab-control-content"><i className="vc-ui-editor-tab-control-icon vc-ui-icon vc-ui-icon-mobile-menu"></i><span>Menu</span></span>
                </dt>
                <dd className="vc-ui-editor-tab-dropdown-content">
                  <a className="vc-ui-editor-tab" href="#" ><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i>Save as draft</span></a>
                  <a className="vc-ui-editor-tab" href="#" ><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i>View page</span></a>
                  <a className="vc-ui-editor-tab" href="#" ><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i>Backend editor</span></a>
                  <a className="vc-ui-editor-tab" href="#" ><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i>WPB Dashboard</span></a>
                  <a className="vc-ui-editor-tab" href="#" ><span className="vc-ui-editor-tab-content"><i className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-bug"></i>WordPress Admin</span></a>
                </dd>
              </dl>

            </nav>
          </div>
        </div>

        <div className="vc-ui-tree-content-footer">
          <div className="vc-ui-tree-layout-actions" data-reactid=".4.0.0.0.0.1">
            <a className="vc-ui-tree-layout-action" href="#" title="title bug"><span className="vc-ui-tree-layout-action-content"><i className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-close"></i></span></a>
            <a className="vc-ui-tree-layout-action" href="#" title="Template"><span className="vc-ui-tree-layout-action-content"><i className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-save"></i></span></a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TreeContent;