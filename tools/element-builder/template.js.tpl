window.vcvAddElement(
  {{ settings() }},
  // Component callback
  function(component) {
    // {{ cssFile() }}
    component.add(React.createClass({
      getInitialState: function() {
         return this.props.atts.componentState || {}
      },
      componentDidMount: function () {
         let state = this.props.atts.componentState || {}
         {{ onMountTemplate() }}
         if (!Object.getOwnPropertyNames(state).length) {
             return
         }
         this.props.stateUpdater(state)
         this.setState(state)
      },
      render: function() {
        // import variables
        {{ variables() }}
        // import template js
        {{ templateJs() }}
        // import template
        return ({{ template() }});
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
