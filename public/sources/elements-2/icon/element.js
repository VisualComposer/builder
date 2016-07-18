window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"icon"},"name":{"type":"string","access":"protected","value":"Icon"},"category":{"type":"string","access":"protected","value":"Content"},"meta_intro":{"type":"textarea","access":"protected","value":"Short intro"},"meta_description":{"type":"textarea","access":"protected","value":"Long description"},"meta_preview_description":{"type":"textarea","access":"protected","value":"Medium preview description"},"meta_preview":{"type":"attachimage","access":"protected","value":"preview.png"},"meta_thumbnail":{"type":"attachimage","access":"protected","value":"thumbnail.png"},"meta_icon":{"type":"attachimage","access":"protected","value":"icon.png"},"fontawesomeIcons":{"type":"iconpicker","access":"public","value":"fa fa-heart","options":{"label":"Fontawesome icons","description":"Select the icon"}},"lineIcons":{"type":"iconpicker","access":"public","value":"vcv-ui-icon-lineicons vcv-ui-icon-lineicons-heart","options":{"label":"Line icons","description":"Select the icon","type":"lineicons"}},"entypoIcons":{"type":"iconpicker","access":"public","value":"vcv-ui-icon-entypo vcv-ui-icon-entypo-heart","options":{"label":"Entypo icons","description":"Select the icon","type":"entypo"}},"monosocialIcons":{"type":"iconpicker","access":"public","value":"vcv-ui-icon-monosocial vcv-ui-icon-monosocial-heart","options":{"label":"Monosocial icons","description":"Select the icon","type":"monosocial"}},"typiconsIcons":{"type":"iconpicker","access":"public","value":"typcn typcn-heart","options":{"label":"Typicons icons","description":"Select the icon","type":"typicons"}},"openiconicIcons":{"type":"iconpicker","access":"public","value":"vcv-ui-icon-openiconic vcv-ui-icon-openiconic-heart","options":{"label":"openiconic icons","description":"Select the icon","type":"openiconic"}},"materialIcons":{"type":"iconpicker","access":"public","value":"vcv-ui-icon-material vcv-ui-icon-material-add_alert","options":{"label":"material icons","description":"Select the icon","type":"material"}},"editFormTab1":{"type":"group","access":"protected","value":["fontawesomeIcons","lineIcons","entypoIcons","monosocialIcons","typiconsIcons","openiconicIcons","materialIcons"],"options":{"label":"Options"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General"]}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {fontawesomeIcons, lineIcons, entypoIcons, monosocialIcons, typiconsIcons, openiconicIcons, materialIcons, id, content, ...other} = this.props
        // import template js
        
        // import template
        return (<div {...other}>
  <span className={fontawesomeIcons}></span>
  <span className={lineIcons}></span>
  <span className={entypoIcons}></span>
  <span className={monosocialIcons}></span>
  <span className={typiconsIcons}></span>
  <span className={openiconicIcons}></span>
  <span className={materialIcons}></span>
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
