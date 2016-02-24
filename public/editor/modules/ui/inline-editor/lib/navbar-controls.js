var vcCake = require('vc-cake');
vcCake.add('ui-inline-editor', function(api){
  var React = require('react');
  var Control = React.createClass({
    getInitialState: function() {
      return {
        show: false
      };
    },
    render: function() {
      var style = {};
      if(true !== this.state.show) {
        style.display = 'none';
      }
      return  <div className="vc-ui-navbar-controls-group vc-ui-navbar-hidden-sm" style={style}>
        <a className="vc-ui-navbar-control" href="#" title="Undo"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-undo"></i><span>Undo</span></span></a>
        <a className="vc-ui-navbar-control" href="#" title="Redo" disabled><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-redo"></i><span>Redo</span></span></a>
      </div>;
    }
  });
  api.module('ui-navbar').do('addElement', 'Inline editor', Control, 'left');
});