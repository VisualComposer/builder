window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Single Image"},"image":{"type":"attachimage","access":"public","value":{"ids":[],"urls":[]},"options":{"label":"Image","multiple":false}},"style":{"type":"dropdown","access":"public","value":"","options":{"label":"Style","values":[{"label":"Default","value":""},{"label":"Rounded","valye":"vc_box_rounded"},{"label":"Border","valye":"vc_box_border"},{"label":"Outline","valye":"vc_box_outline"},{"label":"Shadow","valye":"vc_box_shadow"},{"label":"Round","valye":"vc_box_circle"}]}},"tag":{"access":"protected","type":"string","value":"d707a131-095f-49d7-9055-7eba6ee998c7"}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {image, style, id, content, ...other} = this.props
        // import template js
        var url = image && image.urls.length ? image.urls[0] : 'http://alpha.visualcomposer.io/wp-content/uploads/2016/05/hero.png'

        // import template
        return <img src={url} {...other} />
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
