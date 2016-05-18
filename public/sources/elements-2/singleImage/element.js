window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Single Image"},"image":{"type":"attachimage","access":"public","value":{"ids":[],"urls":[]},"options":{"label":"Image","multiple":false}},"tag":{"access":"protected","type":"string","value":"fbcfda40-18ee-4ca6-b692-99d86431e715"}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {image, id, content, ...other} = this.props
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
