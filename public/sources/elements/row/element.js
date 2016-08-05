window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Row"},"category":{"type":"string","access":"protected","value":"Content"},"metaIntro":{"type":"textarea","access":"protected","value":"Short intro"},"metaDescription":{"type":"textarea","access":"protected","value":"Long description"},"metaPreviewDescription":{"type":"textarea","access":"protected","value":"Medium preview description"},"metaPreview":{"type":"attachimage","access":"protected","value":"preview.png"},"metaThumbnail":{"type":"attachimage","access":"protected","value":"thumbnail.png"},"metaIcon":{"type":"attachimage","access":"protected","value":"icon.png"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"editFormTab1":{"type":"group","access":"protected","value":["background"],"options":{"label":"Options"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General","RootElements"]},"containerFor":{"type":"group","access":"protected","value":["Column"]},"tag":{"access":"protected","type":"string","value":"row"},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {id, content, atts, editor} = this.props
var {background} = atts

        // import template js
        var inlineStyle = {};
if (!!background) {
  inlineStyle = {
    backgroundColor: background
  };
}


        // import template
        return (<div className="vce-row" data-vcv-dropzone="true" style={inlineStyle} {...editor}>
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
