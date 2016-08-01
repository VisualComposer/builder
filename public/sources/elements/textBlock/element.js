window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"textBlock"},"name":{"type":"string","access":"protected","value":"Text block"},"category":{"type":"string","access":"protected","value":"Content"},"meta_intro":{"type":"textarea","access":"protected","value":"Short intro"},"meta_description":{"type":"textarea","access":"protected","value":"Long description"},"meta_preview_description":{"type":"textarea","access":"protected","value":"Medium preview description"},"meta_preview":{"type":"attachimage","access":"protected","value":"preview.png"},"meta_thumbnail":{"type":"attachimage","access":"protected","value":"thumbnail.png"},"meta_icon":{"type":"attachimage","access":"protected","value":"icon.png"},"output":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"outputInline":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block","tinymce":{"inline":true,"toolbar":"bold italic | alignleft aligncenter alignright alignjustify"}}},"editFormTab1":{"type":"group","access":"protected","value":["output","outputInline"],"options":{"label":"Options"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General"]}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {id, content, atts, editor} = this.props
var {output, outputInline} = atts

        // import template js
        
        // import template
        return (<div className='vce-text-block' {...editor}>
  <div className='editable' data-vcv-editable-param='output' dangerouslySetInnerHTML={{__html:output}} />
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
