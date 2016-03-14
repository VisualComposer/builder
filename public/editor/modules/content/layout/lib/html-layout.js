var vcCake = require('vc-cake');
var React = require('react');
require('../css/html-layout.less');
var Element = require('./element');

var Layout = React.createClass({
  render: function() {
    let documentData = vcCake.getService('document');
    let elementsList;
    if (this.props.data) {
      elementsList = this.props.data.map(function(element) {
        return <Element element={element} key={element.id}/>
      });
    }
    return (<div className="vc-v-layouts-html" data-vcv-module="content-layout">
      {elementsList}
    </div>);
  }
});
module.exports = Layout;
