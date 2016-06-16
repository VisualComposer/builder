window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Row"},"category":{"type":"string","access":"protected","value":"Content"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"tag":{"access":"protected","type":"string","value":"0337ccac-fe49-41a2-8a69-2bca05ebfd58"},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
	
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
        return (<div className="vce-row" data-vcv-dropzone="true" style={inlineStyle} {...other}>
  {content}
</div>
);
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
