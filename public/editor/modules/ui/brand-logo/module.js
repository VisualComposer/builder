var vcCake = require('vc-cake');
vcCake.add('ui-brand-logo', function(api) {
  var React = require('react');
  var Control = React.createClass({
    render: function(){
      var url = 'https://vc.wpbakery.com/';
      return <a className="navbar-brand" href={url} target="_blank"><span className="vcv-logo"></span></a>;
    }
  })
  api.module('ui-navbar').do('addElement', 'Get link', Control, 'header');
});