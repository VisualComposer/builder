window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"heroSection"},"name":{"type":"string","access":"protected","value":"Hero Section"},"category":{"type":"string","access":"protected","value":"Content"},"meta_intro":{"type":"textarea","access":"protected","value":"Short intro"},"meta_description":{"type":"textarea","access":"protected","value":"Long description"},"meta_preview_description":{"type":"textarea","access":"protected","value":"Medium preview description"},"meta_preview":{"type":"attachimage","access":"protected","value":"preview.png"},"meta_thumbnail":{"type":"attachimage","access":"protected","value":"thumbnail.png"},"meta_icon":{"type":"attachimage","access":"protected","value":"icon.png"},"title":{"type":"htmleditor","access":"public","value":"Highland Traditions of Scotland","options":{"label":"Title","description":"The title"}},"subtitle":{"type":"htmleditor","access":"public","value":"The region became culturally distinguishable from the Lowlands from the later Middle Ages into the modern period.","options":{"label":"Sub title","description":"The subtitle"}},"editFormTab1":{"type":"group","access":"protected","value":["title"],"options":{"label":"General"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1"]},"relatedTo":{"type":"group","access":"protected","value":["General"]}},
  // Component callback
  function(component) {
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {id, content, atts, editor} = this.props
var {title, subtitle} = atts

        // import template js
        let classNames = require('classnames')

let wrapperClasses = classNames({
  'vcv-e-hero-section': true,
  'vcv-e-hero-section-align--left': true,
  'vcv-e-hero-section-align--right': true,
  'vcv-e-hero-section-align--center': true,
  'vcv-e-hero-section-align--justify': true
})

        // import template
        return (<div className={wrapperClasses} {...editor}>
  <h2 dangerouslySetInnerHTML={{ __html: title }} />
  <p>{subtitle}</p>
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
