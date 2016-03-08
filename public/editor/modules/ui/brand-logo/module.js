var vcCake = require('vc-cake');
vcCake.add('ui-brand-logo', function(api) {
  var React = require('react');
  var Control = React.createClass({
    render: function(){
      var url = 'https://vc.wpbakery.com/';
      return <a className="vc-ui-navbar-logo" title="Visual Composer" href="http://vc.wpbakery.com/?utm_campaign=VCplugin&amp;utm_source=vc_user&amp;utm_medium=frontend_editor" target="_blank">
        <span className="vc-ui-navbar-logo-title">Visual Composer</span>
      </a>;
    }
  })
  api.module('ui-navbar').do('addElement', 'Get link', Control, 'header');
});