var vcCake = require('vc-cake');
var React = require('react');
require('../css/tree/init.less');
var Element = require('./element.js');
var DataChanged = {
  componentDidMount: function() {
    this.props.api.reply('data:changed', function(data) {
      this.setState({data: data});
    }.bind(this));
  },
  getInitialState: function() {
    return {
      data: []
    }
  }
};
var Layout = React.createClass({
  mixins: [DataChanged],
  getElements: function() {
    let elementsList;
    let document = vcCake.getService('document');
    if (this.state.data) {
      elementsList = this.state.data.map(function(element) {
        let data = document.children(element.id);
        return <Element element={element} data={data} key={element.id} level={1} api={this.props.api}/>
      }, this);
    }
    return elementsList;
  },
  handleAddElement: function() {
    this.props.api.request('app:add', false);
  },
  render: function() {
    return (
      <div className="vc-ui-tree-layout-container">
        <ul className="vc-ui-tree-layout">
          {this.getElements()}
        </ul>
        <div className="vc-ui-tree-layout-actions">
          <a className="vc-ui-tree-layout-action" href="#" title="Add Element" onClick={this.handleAddElement}><span
            className="vc-ui-tree-layout-action-content"><i
            className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-add"></i><span>Add element</span></span></a>
          <a className="vc-ui-tree-layout-action" href="#" title="Template"><span
            className="vc-ui-tree-layout-action-content"><i
            className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-template"></i><span>Template</span></span></a>
        </div>
      </div>
    );
  }
});
module.exports = Layout;