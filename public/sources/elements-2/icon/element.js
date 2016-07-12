window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"icon"},"name":{"type":"string","access":"protected","value":"Icon"},"category":{"type":"string","access":"protected","value":"Content"},"meta_intro":{"type":"textarea","access":"protected","value":"Short intro"},"meta_description":{"type":"textarea","access":"protected","value":"Long description"},"meta_preview_description":{"type":"textarea","access":"protected","value":"Medium preview description"},"meta_preview":{"type":"attachimage","access":"protected","value":"preview.png"},"meta_thumbnail":{"type":"attachimage","access":"protected","value":"thumbnail.png"},"meta_icon":{"type":"attachimage","access":"protected","value":"icon.png"},"icon":{"type":"iconpicker","access":"public","value":"","options":{"label":"Icon","description":"Select the icon"}},"editFormTab1":{"type":"group","access":"protected","value":["icon"],"options":{"label":"Options"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General"]}},
  // Component callback
  function(component) {
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {icon, id, content, ...other} = this.props
        // import template js
        
        // import template
        return (<div {...other}>
  <span>Icon element</span>
  <span dangerouslySetInnerHTML={{__html:icon}}></span>
  <span className={icon}></span>
</div>);
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
