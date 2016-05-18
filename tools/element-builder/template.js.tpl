window.vcvAddElement(
  {{ settings() }},
  // Component callback
  function(component) {
	{{ cssFile() }}
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
