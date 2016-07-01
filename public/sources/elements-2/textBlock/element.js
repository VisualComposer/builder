window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"4fbdf10a-6134-4453-9e9f-10b6d9a1f8bd"},"name":{"type":"string","access":"protected","value":"Text block"},"category":{"type":"string","access":"protected","value":"Content"},"output":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"editFormTab1":{"type":"group","access":"protected","value":["output"],"options":{"label":"Tab1"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General"]}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {output, id, content, ...other} = this.props
        // import template js
        
        // import template
        return (<div className='vce-text-block' {...other}>
  <div className='editable' data-vc-editable-param='output' dangerouslySetInnerHTML={{__html:output}} />
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
