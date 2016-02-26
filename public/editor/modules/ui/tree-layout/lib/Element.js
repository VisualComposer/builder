var vcCake = require('vc-cake');
var React = require('react');
var ElementComponents = vcCake.getService('element').components;
var classNames = require('classnames');

var Element = React.createClass({
  getInitialState: function() {
    return {
      childExpand: true,
      hasContent: false
    }
  },
  clickChildExpand: function() {
    this.setState({childExpand: !this.state.childExpand});
  },
  getContent: function() {
    if (this.props.data.length) {
      let level = this.props.level + 1;
      let document = vcCake.getService('document');
      let elementsList = this.props.data.map(function(element) {
        let data = document.children(element.id)
        return <Element element={element} data={data} key={element.id} level={level}/>;
      });
      return <ul className="vc_ui-tree-node">{elementsList}</ul>;
    }
    return '';
  },
  render: function() {
    var element = this.props.element;
    var ElementComponent = ElementComponents.get(element);
    var treeChildClass = classNames({
      'vc_ui-tree-child': true,
      'vc_ui-expand': this.state.childExpand
    });
    var content = 'container' == ElementComponent.type ? this.getContent() : ''; // yes == not === it is required :P
    this.state.hasContent = !!content;
    var addChildControl = 'container' == ElementComponent.type ?
      <a className="vc_ui-tree-child-control" onClick={this.clickAddChild}><i className="glyphicon glyphicon-plus"></i></a> : '';
    var expandTrigger = this.state.hasContent ?
      <i className="vc_ui-tree-child-expand-trigger glyphicon glyphicon-triangle-right"
         onClick={this.clickChildExpand}>
      </i> : '';
    var childControls =
      <span className="vc_ui-tree-child-controls">
        {addChildControl}
        <a className="vc_ui-tree-child-control" onClick={this.clickEdit}><i className="glyphicon glyphicon-pencil"></i></a>
        <a className="vc_ui-tree-child-control" onClick={this.clickDelete}><i className="glyphicon glyphicon-minus"></i></a>
        <a className="vc_ui-tree-child-control" onClick={this.clickClone}><i
          className="glyphicon glyphicon-duplicate"></i></a>
      </span>;
    return <li className={treeChildClass}>
      <div className="vc_ui-tree-child-row" style={{paddingLeft: this.props.level + 0.5 + 'em'}}>
        <div className="vc_ui-tree-child-col">
          {expandTrigger}
            <span className="vc_ui-tree-child-label">
              <i className="vc_ui-tree-child-label-icon glyphicon glyphicon-th"></i>
              <span>{ElementComponent.name.toString()}</span>
            </span>
          {childControls}
        </div>
      </div>
      {content}
      <div style={{display: 'none'}}>
        <i className="glyphicon glyphicon-th"></i>
        {element.element}
        <a onClick={this.addChild} style={{display: 'none'}}>
          <i className="glyphicon glyphicon-plus"></i>
        </a>
      </div>
    </li>;
  }
});
module.exports = Element;