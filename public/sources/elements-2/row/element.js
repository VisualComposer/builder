import {getService} from 'vc-cake';
getService('cook').add(
  {"name":{"type":"string","access":"protected","value":"Row"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"tag":{"access":"protected","type":"string","value":"ac122b5a-4bc6-4436-934d-4123b178435e"},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
    var React = require('react');
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {background, id, content, ...other} = this.props
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
