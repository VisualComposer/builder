window.vcvAddElement(
  {"name":{"type":"string","access":"protected","value":"Column"},"background":{"type":"color","access":"public","value":"","options":{"label":"Background color"}},"size":{"type":"dropdown","access":"public","value":"auto","options":{"label":"Column width","values":[{"label":"Auto","value":"auto"},{"label":"1 : 12","value":"1-12"},{"label":"2 : 12","value":"2-12"},{"label":"3 : 12","value":"3-12"},{"label":"4 : 12","value":"4-12"},{"label":"5 : 12","value":"5-12"},{"label":"6 : 12","value":"6-12"},{"label":"7 : 12","value":"7-12"},{"label":"8 : 12","value":"8-12"},{"label":"9 : 12","value":"9-12"},{"label":"10 : 12","value":"10-12"},{"label":"11 : 12","value":"11-12"},{"label":"12 : 12","value":"12-12"}]}},"tag":{"access":"protected","type":"string","value":"8ca1a6ee-4874-481d-a5cf-aa9f2a06769f"},"type":{"access":"protected","type":"string","value":"container"}},
  // Component callback
  function(component) {
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {background, size, id, content, ...other} = this.props
        // import template js
        var inlineStyle = {};
if (!!background) {
  inlineStyle = {
    backgroundColor: background
  };
}

var columnClasses = 'vce-col' + ' vce-col-' + size;


        // import template
        return <div className={columnClasses} {...other} data-vcv-dropzone="true" style={inlineStyle}>
  {content}
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
