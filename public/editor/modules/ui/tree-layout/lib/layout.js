var vcCake = require('vc-cake');
var React = require('react');

require('../css/tree/tree-init.less');
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
      data: []
    }
  }
};
module.exports = React.createClass({
  mixins: [DataChanged],
  render: function () {
    let elementsList;
    let document = vcCake.getService('document');
    if (this.state.data) {
      elementsList = this.state.data.map(function (element) {
        let data = document.children(element.id);
        return <Element element={element} data={data} key={element.id} level={1}/>
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