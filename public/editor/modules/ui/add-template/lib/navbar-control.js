var vcCake = require('vc-cake');
vcCake.add('ui-add-template', function(api){
  var React = require('react');
  var Control = React.createClass({
    handleClick: function(e) {
      e && e.preventDefault();
    },
    render: function() {
      return (<a className="vc-ui-navbar-control" onClick={this.handleClick} title="Template"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-template"></i><span>Template</span></span></a>
      );
    }
  });
  api.module('ui-navbar').do('addElement', 'Add template', Control, 'left');
});