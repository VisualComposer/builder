var vcCake = require('vc-cake');
vcCake.add('ui-undo-redo', function(api){
  var React = require('react');
  var Control = React.createClass({
    componentWillMount: function() {
      api.on('added', this.checkControls);
    },
    checkControls: function() {
      var timeMachine = vcCake.getService('time-machine');
      this.setState({
        redoDisabled: !timeMachine.canRedo(),
        undoDisabled: !timeMachine.canUndo()
      });
    },
    getInitialState: function() {
      return {
        redoDisabled: true,
        undoDisabled: true
      };
    },
    handleUndo: function() {
      var timeMachine = vcCake.getService('time-machine');
      api.request('data:reset', timeMachine.undo());
    },
    handleRedo: function() {
      var timeMachine = vcCake.getService('time-machine');
      api.request('data:reset', timeMachine.redo());
    },
    render: function() {
      return  <div className="vc-ui-navbar-controls-group vc-ui-navbar-hidden-sm">
        <a className="vc-ui-navbar-control" href="#" title="Undo"  disabled={this.state.undoDisabled} onClick={this.handleUndo}><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-undo"></i><span>Undo</span></span></a>
        <a className="vc-ui-navbar-control" href="#" title="Redo" disabled={this.state.redoDisabled} onClick={this.handleRedo}><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-redo"></i><span>Redo</span></span></a>
      </div>;
    }
  });
  api.module('ui-navbar').do('addElement', 'Undo/Redo', Control);
});