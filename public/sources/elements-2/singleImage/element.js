window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Single Image"},"image":{"type":"attachimage","access":"public","value":"http://alpha.visualcomposer.io/wp-content/uploads/2016/05/hero.png","options":{"label":"Image","multiple":false}},"style":{"type":"dropdown","access":"public","value":"","options":{"label":"Style","values":[{"label":"Default","value":""},{"label":"Rounded","valye":"vc_box_rounded"},{"label":"Border","valye":"vc_box_border"},{"label":"Outline","valye":"vc_box_outline"},{"label":"Shadow","valye":"vc_box_shadow"},{"label":"Round","valye":"vc_box_circle"}]}},"tag":{"access":"protected","type":"string","value":"938f2d1a-c191-45dd-9b3e-c36688d78484"}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {image, style, id, content, ...other} = this.props
        // import template js
        
        // import template
        return (<img src={image}  {...other}/>
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
