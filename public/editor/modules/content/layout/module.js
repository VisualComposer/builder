var vcCake = require('vc-cake');
vcCake.add('editor-content-layout', function(api) {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var HtmlLayout = require('./lib/html-layout');
  var DataChanged = {
  componentDidMount: function() {
    api.reply('data:changed', function(data) {
      this.setState({data: data});
    }.bind(this));
  },
  getInitialState: function() {
    return {
      data: [],
    };
  }
};
  var Editor = React.createClass({
    mixins: [DataChanged],
    render: function() {
      var data = this.state.data;
      return (
        <div className="vc-editor-here">
          <HtmlLayout data={data}/>
        </div>
      );
    }
  });
    ReactDOM.render(
    <Editor />,
    document.getElementById('vc_v-editor')
  );
});
