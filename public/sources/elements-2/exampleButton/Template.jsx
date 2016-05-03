var React = require('react');
return React.createClass({
  templateJs: function(data, settings) {
    return data;
  },
  render: function() {
    var data = this.templateJs(this.props.data, this.props.settings);
    return <button type="button" className="vce-example-button vc-example-button-{data.shape}" key={key}>
      {data.content}
    </button>;
  }
});