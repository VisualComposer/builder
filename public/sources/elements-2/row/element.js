window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Row"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"tag":{"access":"protected","type":"string","value":"18a95a2e-c0d5-428b-ac11-b2eea788b221"},"type":{"access":"protected","type":"string","value":"container"}},
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
