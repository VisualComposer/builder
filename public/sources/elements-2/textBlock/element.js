window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"9ffbe755-b33a-423b-81e9-c653b6635dde"},"name":{"type":"string","access":"protected","value":"Text block"},"category":{"type":"string","access":"protected","value":"Content"},"output":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"output2":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"output3":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"output4":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"output5":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"output6":{"type":"htmleditor","access":"public","value":"<p>Put your HTML</p>","options":{"label":"Content","description":"Content for text block"}},"editFormTab1":{"type":"group","access":"protected","value":["output","output2","output3"],"options":{"label":"Tab1"}},"editFormTab2":{"type":"group","access":"protected","value":["output4","output5","output6"],"options":{"label":"Tab2"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab2","editFormTab1"]}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {output, output2, output3, output4, output5, output6, id, content, ...other} = this.props
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
