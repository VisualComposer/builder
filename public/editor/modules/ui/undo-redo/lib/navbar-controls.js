var vcCake = require('vc-cake');
vcCake.add('ui-inline-editor', function(api){
  var React = require('react');
  var Control = React.createClass({
    getInitialState: function() {
      return {
        show: false
        redoDisabled: false,
        undodisabled: false
      };
    },
    render: function() {
      return  <div className="vc-ui-navbar-controls-group vc-ui-navbar-hidden-sm">
        <a className="vc-ui-navbar-control" href="#" title="Undo"  disabled={this.state.undoDisabled}><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-undo"></i><span>Undo</span></span></a>
        <a className="vc-ui-navbar-control" href="#" title="Redo" disabled={this.state.redoDisabled}><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-redo"></i><span>Redo</span></span></a>
      </div>;
    }
  });
  api.module('ui-navbar').do('addElement', 'Inline editor', Control, 'left');
});