var vcCake = require('vc-cake');

var React = require('react');
require('../css/tree/tree-init.less');
var Utils = vcCake.getService('utils');
var Element = require('./element.js');
var DataChanged = {
  componentDidMount: function() {
    /*// @todo move to layout tree
    api.reply('layout:tree', function() {
      this.setState({menuExpand: true});
    }.bind(this));
    this.subscribe('data:changed', function(document) {
      this.setState({data: document});
    }.bind(this));*/
  },
  getInitialState: function() {
    return {
      data: {}
    }
  }
};
module.exports = React.createClass({
  mixins: [DataChanged],
  render: function () {
    let elementsList;
    if (this.state.data.childNodes) {
      let data = Array.prototype.slice.call(this.state.data.childNodes);
      let rootElement = data[0];
      elementsList = Array.prototype.slice.call(rootElement.childNodes).map(function (element) {
        let data = Array.prototype.slice.call(element.childNodes);
        return <Element element={element} data={data} key={element.getAttribute('id')} level={1}/>
      });
    }
    return (<div className="vc_ui-tree-dropdown">
      <div className="vc_ui-tree-nodes-container">
        <ul className="vc_ui-tree-node">
          {elementsList}
        </ul>
      </div>
      <div className="vc_ui-tree-nodes-controls">controls</div>
    </div>);
  }
});