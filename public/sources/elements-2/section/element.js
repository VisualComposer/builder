import {getService} from 'vc-cake';
getService('cook').add(
  {"tag":{"access":"protected","type":"string","value":"828447be-52fe-48b2-935e-1b900253a140"},"name":{"type":"string","access":"protected","value":"Section"},"bgimage":{"type":"attachimage","access":"public","value":{"ids":[],"urls":[]},"options":{"label":"Background Image","multiple":false}},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
    var React = require('react');
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {bgimage, id, content, ...other} = this.props;
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
