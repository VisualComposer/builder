window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Single Image"},"image":{"type":"attachimage","access":"public","value":{"ids":[],"urls":[]},"options":{"label":"Image","multiple":false}},"tag":{"access":"protected","type":"string","value":"a5c9c316-b0cb-41f1-8836-62d1e7ca3d32"}},
  // Component callback
  function(component) {

    component.add(React.createClass({
      render: function() {
        // import variables
        var {image, id, content, ...other} = this.props
        // import template js
        var url = image && image.urls.length ? image.urls[0] : 'https://static.pexels.com/photos/1440/city-road-street-buildings.jpg'

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