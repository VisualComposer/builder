import {getService} from 'vc-cake';
getService('cook').add(
  {{ settings() }},
  // Component callback
  function(component) {
    var React = require('react');
    component.add(React.createClass({
      render: function() {
        // import variables
        {{ variables() }}
        // import template js
        {{ templateJs() }}
        // import template
        return {{ template() }};
      }
    }));
  },
  // css settings // css for element
  {{ cssSettings() }},
  // javascript callback
  {{ jsCallback() }},
  // editor js
  {{ editorJsSettings() }}
);
