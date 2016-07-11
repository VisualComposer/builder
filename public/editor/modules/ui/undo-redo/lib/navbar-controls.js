/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-undo-redo', function (api) {
  var React = require('react')
  var Control = React.createClass({
    componentWillMount: function () {
      api.on('added', this.checkControls)
    },
    checkControls: function () {
      var timeMachine = vcCake.getService('time-machine')
      this.setState({
        redoDisabled: !timeMachine.canRedo(),
        undoDisabled: !timeMachine.canUndo()
      })
    },
    getInitialState: function () {
      return {
        redoDisabled: true,
        undoDisabled: true
      }
    },
    handleUndo: function () {
      var timeMachine = vcCake.getService('time-machine')
      api.request('data:reset', timeMachine.undo())
    },
    handleRedo: function () {
      var timeMachine = vcCake.getService('time-machine')
      api.request('data:reset', timeMachine.redo())
    },
    render: function () {
      return <div className="vcv-ui-navbar-controls-group vcv-ui-navbar-hidden-sm">
        <a className="vcv-ui-navbar-control" href="#" title="Undo" disabled={this.state.undoDisabled} onClick={this.handleUndo}><span className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-undo"></i><span>Undo</span></span></a>
        <a className="vcv-ui-navbar-control" href="#" title="Redo" disabled={this.state.redoDisabled} onClick={this.handleRedo}><span className="vcv-ui-navbar-control-content"><i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-redo"></i><span>Redo</span></span></a>
      </div>
    }
  })
  api.module('ui-navbar').do('addElement', 'Undo/Redo', Control)
})
