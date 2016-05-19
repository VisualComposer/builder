window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"2103f019-72d9-44cc-8ff0-05c49c7e6521"},"name":{"type":"string","access":"protected","value":"Text block"},"output":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {output, id, content, ...other} = this.props
        // import template js
        
        // import template
        return <div className='vce-text-block' {...other}><div dangerouslySetInnerHTML={{__html:output}} /></div>
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
