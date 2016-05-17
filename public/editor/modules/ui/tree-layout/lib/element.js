/*eslint jsx-quotes: ["error", "prefer-double"]*/
var vcCake = require('vc-cake')
var React = require('react')
var cook = vcCake.getService('cook')
var classNames = require('classnames')

var Element = React.createClass({
  propTypes: {
    element: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    api: React.PropTypes.object.isRequired,
    level: React.PropTypes.number
  },
  getInitialState: function () {
    return {
      childExpand: true,
      hasChild: false
    }
  },
  clickChildExpand: function () {
    this.setState({ childExpand: !this.state.childExpand })
  },
  clickAddChild: function (e) {
    e.preventDefault()
    this.props.api.request('app:add', this.props.element.id)
  },
  clickClone: function (e) {
    e.preventDefault()
    this.props.api.request('data:clone', this.props.element.id)
  },
  clickEdit: function (e) {
    e.preventDefault()
    this.props.api.request('app:edit', this.props.element.id)
  },
  clickDelete: function (e) {
    e.preventDefault()
    this.props.api.request('data:remove', this.props.element.id)
  },
  getContent: function () {
    if (this.props.data.length) {
      let level = this.props.level + 1
      let document = vcCake.getService('document')
      let elementsList = this.props.data.map(function (element) {
        let data = document.children(element.id)
        return <Element element={element} data={data} key={element.id} level={level} api={this.props.api} />
      }, this)
      return <ul className="vc-ui-tree-layout-node">{elementsList}</ul>
    }
    return ''
  },
  render: function () {
    var element = cook.get(this.props.element)
    var treeChildClass = classNames({
      'vc-ui-tree-layout-node-child': true,
      'vc-ui-tree-layout-node-expand': this.state.childExpand,
      'vc-ui-tree-layout-node-state-draft': false
    })
    var child = element.get('type') === 'container' ? this.getContent() : '' // yes == not === it is required :P
    this.state.hasChild = !!child
    var addChildControl = element.get('type') === 'container' ? <a className="vc-ui-tree-layout-control-action" title="Add" onClick={this.clickAddChild}><i className="vc-ui-icon vc-ui-icon-add-thin"></i></a> : false
    var expandTrigger = this.state.hasChild ? <i className="vc-ui-tree-layout-node-expand-trigger vc-ui-icon vc-ui-icon-expand" onClick={this.clickChildExpand} /> : ''
    var childControls = <span className="vc-ui-tree-layout-control-actions">
      {addChildControl}
      <a className="vc-ui-tree-layout-control-action" title="Edit" onClick={this.clickEdit}><i className="vc-ui-icon vc-ui-icon-edit" /></a>
      <a className="vc-ui-tree-layout-control-action" title="Delete" onClick={this.clickDelete}><i className="vc-ui-icon vc-ui-icon-close-thin" /></a>
      <a className="vc-ui-tree-layout-control-action" title="Clone" onClick={this.clickClone}><i className="vc-ui-icon vc-ui-icon-copy" /></a>
    </span>
    return <li className={treeChildClass}>
      <div className="vc-ui-tree-layout-control" style={{paddingLeft: this.props.level + 1 + 'em'}}>
        <div className="vc-ui-tree-layout-control-drag-handler"><i
          className="vc-ui-tree-layout-control-drag-handler-icon vc-ui-icon vc-ui-icon-drag-dots" /></div>
        <div className="vc-ui-tree-layout-control-content">
          {expandTrigger}
          <span className="vc-ui-tree-layout-control-icon">
            <i className="vc-ui-icon vc-ui-icon-bug" />
          </span>
          <span className="vc-ui-tree-layout-control-label">
            <span>{element.get('name')}</span>
          </span>
          {childControls}
        </div>
      </div>
      {child}
    </li>
  }
})
module.exports = Element
