window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"heroSection"},"name":{"type":"string","access":"protected","value":"Hero Section"},"category":{"type":"string","access":"protected","value":"Content"},"metaIntro":{"type":"textarea","access":"protected","value":"Short intro"},"metaDescription":{"type":"textarea","access":"protected","value":"Long description"},"metaPreviewDescription":{"type":"textarea","access":"protected","value":"Medium preview description"},"metaPreview":{"type":"attachimage","access":"protected","value":"preview.png"},"metaThumbnail":{"type":"attachimage","access":"protected","value":"thumbnail.png"},"metaIcon":{"type":"attachimage","access":"protected","value":"icon.png"},"title":{"type":"htmleditor","access":"public","value":"<h1>Highland Traditions of Scotland</h1>","options":{"label":"Title","description":"The title","tinymce":{"inline":true,"toolbar":"bold italic | alignleft aligncenter alignright alignjustify"}}},"description":{"type":"htmleditor","access":"public","value":"<p>The region became culturally distinguishable from the Lowlands from the later Middle Ages into the modern period.</p>","options":{"label":"Description","description":"The description"}},"image":{"type":"attachimage","access":"public","value":"","options":{"label":"Image","multiple":false}},"align":{"type":"dropdown","access":"public","value":"center","options":{"label":"Content alignment","description":"Select the content alignment","values":[{"label":"Left","value":"start"},{"label":"Center","value":"center"},{"label":"Right","value":"end"}]}},"addButton":{"type":"toggle","access":"public","value":true,"options":{"label":"Add button","description":"[ON] Will add the button to content"}},"button":{"type":"element","access":"public","value":{},"options":{"label":"Button","tag":"simpleButton","onChange":{"addButton":[{"rule":"toggle","current":[{"action":"toggleVisibility","options":[]}]}]}}},"editFormTab1":{"type":"group","access":"protected","value":["title","description","image","align","addButton"],"options":{"label":"General"}},"editFormTabs":{"type":"group","access":"protected","value":["editFormTab1","button"]},"relatedTo":{"type":"group","access":"protected","value":["General"]}},
  // Component callback
  function(component) {
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {id, content, atts, editor} = this.props
var {title, description, image, align, addButton, button} = atts

        // import template js
        let classNames = require('classnames')

let wrapperClasses = classNames({
  'vce-hero-section': true,
  'vce-hero-section--min-height': true,
  'vce-hero-section--alignment-start': align === 'start',
  'vce-hero-section--alignment-end': align === 'end'
})

let rowClasses = classNames({
  'vce-hero-section__wrap-row': true
})

let rowStyles = {}
if (image) {
  rowStyles.backgroundImage = `url(${image})`
}
        // import template
        return (<section className={wrapperClasses} {...editor}>
  <div className={rowClasses} style={rowStyles}>
    <div className="vce-hero-section__wrap">
      <div className="vce-hero-section__content">
        <div className='editable' data-vcv-editable-param='title' dangerouslySetInnerHTML={{__html:title}} />
        <div className='editable' data-vcv-editable-param='description' dangerouslySetInnerHTML={{__html:description}} />
      </div>
    </div>
  </div>
</section>
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
