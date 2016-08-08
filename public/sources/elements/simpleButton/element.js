window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"simpleButton"},"category":{"type":"string","access":"protected","value":"Buttons"},"name":{"type":"string","access":"protected","value":"Simple Button"},"metaIntro":{"type":"textarea","access":"protected","value":"Short intro"},"metaDescription":{"type":"textarea","access":"protected","value":"Long description"},"metaPreviewDescription":{"type":"textarea","access":"protected","value":"Medium preview description"},"metaPreview":{"type":"attachimage","access":"protected","value":"preview.png"},"metaThumbnail":{"type":"attachimage","access":"protected","value":"thumbnail.png"},"metaIcon":{"type":"attachimage","access":"protected","value":"icon.png"},"buttonText":{"type":"string","access":"public","value":"Button text","options":{"label":"Button text"}},"editFormTab1":{"type":"group","access":"protected","value":["buttonText"],"options":{"label":"Options"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General"]}},
  // Component callback
  function(component) {
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {id, content, atts, editor} = this.props
var {buttonText} = atts

        // import template js
        
        // import template
        return (<button {...editor}>{buttonText}</button>);
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
