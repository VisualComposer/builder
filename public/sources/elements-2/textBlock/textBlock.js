import {getService} from 'vc-cake';
getService('cook').add(
  {"tag":{"type":"string","access":"protected","value":"textBlock"},"name":{"type":"string","access":"protected","value":"Text block"},"output":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}}},
  // Component callback
  function(component) {
    var React = require('react');
	require( './css/textBlock.css' );
    component.add(React.createClass({
      render: function() {
        // import variables
        var {output, id, content, ...other} = this.props;
        // import template js
        
        // import template
        return <div className='vce-text-block' {...other}><div dangerouslySetInnerHTML={{__html:output}} /></div>
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
