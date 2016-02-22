var vcCake = require('vc-cake');
vcCake.add('ui-add-element', function(api){
  var React = require('react');
  var Control = React.createClass({
    handleClick: function(e) {
      e && e.preventDefault();
      vcCake.getService('data').activeNode = 'vc-v-root-element';
      api.notify('show', true);
    },
    render: function() {
      return (<a className="as_btn" onClick={this.handleClick}><span className="glyphicon glyphicon-plus"></span></a>);
    }
  });
  api.module('ui-navbar').do('addElement', 'Add element', Control, 'left');
});