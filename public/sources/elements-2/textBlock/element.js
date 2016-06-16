window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"84cb6359-b619-46fa-b75c-41f40b59b622"},"name":{"type":"string","access":"protected","value":"Text block"},"category":{"type":"string","access":"protected","value":"Content"},"output":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}}},
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
