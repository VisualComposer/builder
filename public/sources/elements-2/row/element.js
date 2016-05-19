window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Row"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"tag":{"access":"protected","type":"string","value":"69160fc1-35f0-4cbf-a036-d41db626e39e"},"type":{"access":"protected","type":"string","value":"container"}},
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
