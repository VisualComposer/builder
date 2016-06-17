window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Row"},"category":{"type":"string","access":"protected","value":"Content"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"relatedTo":{"type":"group","access":"protected","value":["General"]},"containerFor":{"type":"group","access":"protected","value":["Column"]},"tag":{"access":"protected","type":"string","value":"08bde8ca-0faf-4274-a496-f4c5c59bc76a"},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
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
