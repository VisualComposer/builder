import {getService} from 'vc-cake';
getService('cook').add(
  {"tag":{"access":"protected","type":"string","value":"08c181f6-a2cc-45be-b126-cff60398180d"},"name":{"type":"string","access":"protected","value":"Section"},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
    var React = require('react');
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {id, content, ...other} = this.props;
        // import template js
        
        // import template
        return <div className="vcv-section" {...other} data-vcv-dropzone="true">
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
