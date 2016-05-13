import {getService} from 'vc-cake';
getService('cook').add(
  {"tag":{"access":"protected","type":"string","value":"14b57847-ebdb-49f5-aad0-27a9e30b3cd1"},"name":{"type":"string","access":"protected","value":"Section"},"bgimage":{"type":"attachimage","access":"public","options":{"label":"Background Image"}},"type":{"access":"protected","type":"string","value":"container"}},
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