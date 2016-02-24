var vcCake = require('vc-cake');
var React = require('react');
var Element = require('./lib/element.js');

require('./css/clean-html-layout.less');
vcCake.add('content-wordpress-data-layout', function(api) {
  var DataChanged = {
    componentDidMount: function() {
      this.subscribe('data:changed', function(document) {
        this.setState({data: document});
      }.bind(this));
    },
    getInitialState: function() {
      return {
        data: {}
      }
    }
  };

  var Layout = React.createClass({
    mixins: [DataChanged],
    render: function() {
      let elementsList;
      if (this.state.data.childNodes) {
        let data = Array.prototype.slice.call(this.state.data.childNodes);
        let rootElement = data[0];
        elementsList = Array.prototype.slice.call(rootElement.childNodes).map(function(element) {
          let data = Array.prototype.slice.call(element.childNodes);
          return <Element element={element} data={data} key={element.getAttribute('id')} level={1}/>
        });
      }
      return (<div className="vc-v-layouts-cleanhtml">
        {elementsList}
      </div>);
    }
  });
  // Here comes wrapper for navbar
  var wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'vc-wp-data-layout');
  document.body.appendChild(wrapper);
  ReactDOM.render(
    <Layout/>,
    wrapper
  );

});
