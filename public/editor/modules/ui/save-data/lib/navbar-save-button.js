var vcCake = require('vc-cake');
vcCake.add('ui-save-data', function(api){
  var React = require('react');
  var Control = React.createClass({
    handleClick: function(e) {
      e && e.preventDefault();
      api.notify('app:save', true);
    },
    render: function() {
      return (<li><button type="button" className="btn btn-success navbar-btn" onClick={this.handleClick}>Update</button></li>);
    }
  });
  api.module('ui-navbar').do('addElement', 'Save post', Control, 'right');
});