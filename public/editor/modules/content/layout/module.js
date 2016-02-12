var vcCake = require('vc-cake');
vcCake.add('editor-content-layout', function(api) {
  var React = require('react');
  var HtmlLayout = require('./lib/html-layout');
  var Editor = React.createClass({
    render: function() {
      return (
        <div className="vc-editor-here">
          <HtmlLayout/>
        </div>
      );
    }
  });

  ReactDOM.render(
    <Editor />,
    document.getElementById('vc_v-editor')
  );
});

//                 <EditForm/>
//                 <CleanHtmlLayout/>

