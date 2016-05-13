import {getService} from 'vc-cake';
getService('cook').add(
  {"name":{"type":"string","access":"protected","value":"Row"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"tag":{"access":"protected","type":"string","value":"5bfdcaf3-d213-4c84-8998-6d483fd82e54"},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
    var React = require('react');
	require( './css/styles.css' );
    component.add(React.createClass({
      render: function() {
        // import variables
        var {background, id, content, ...other} = this.props;
        // import template js
        var inlineStyle = {};
if (!!background) {
  inlineStyle = {
    backgroundColor: background
  };
}


        // import template
        return <div className="vce-row" {...other} data-vcv-dropzone="true" style={inlineStyle}>
  {content}
</div>
;
      }
    }));
  },
  // css settings // css for element
  {},
  // javascript callback
  function(){},
  // editor js
  null
);
