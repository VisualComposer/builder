window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"64f4992c-0756-4598-8e59-2030f6ad45a3"},"name":{"type":"string","access":"protected","value":"Section"},"bgimage":{"type":"attachimage","access":"public","value":{"ids":[],"urls":[]},"options":{"label":"Background Image","multiple":false}},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {bgimage, id, content, ...other} = this.props
        // import template js
        var images = []
bgimage.urls.forEach(function (url) {
  images.push(<img key={url} src={url}/>)
})

        // import template
        return <div className="vcv-section" {...other} data-vcv-dropzone="true">
  {content}
  {images}
</div>
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
