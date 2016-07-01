window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Row"},"category":{"type":"string","access":"protected","value":"Content"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"editFormTab1":{"type":"group","access":"protected","value":["background"],"options":{"label":"Options"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General"]},"containerFor":{"type":"group","access":"protected","value":["Column"]},"tag":{"access":"protected","type":"string","value":"515a34d9-497f-4f64-84f5-60ed6a1ca8d8"},"type":{"access":"protected","type":"string","value":"container"}},
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
