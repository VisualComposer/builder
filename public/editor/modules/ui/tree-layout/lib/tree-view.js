/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
var React = require('react')
var classNames = require('classnames')

var TreeLayout = require('./tree-layout')
var EditElement = require('./edit-element/form')

const cook = vcCake.getService('cook')

require('../css/tree-view/init.less')

require('./css/perfect-scrollbar.css')
// var PerfectScrollbar = require('perfect-scrollbar')
// var ReactDOM = require('react-dom')

var TreeView = React.createClass({
  propTypes: {
    api: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      treeContentCount: 0,
      treeHidden: false,
      elementId: false
    }
  },
  componentDidMount: function () {
    this.props.api
      .reply('app:edit', function (id) {
        this.setState({ elementId: id })
      }.bind(this))
      .on('hide', function () {
        this.setState({ elementId: false })
      }.bind(this))
      .on('form:hide', function () {
        this.setState({ elementId: false })
      }.bind(this))
      .on('tree:toggle', function () {
        this.setState({ treeHidden: !this.state.treeHidden })
      }.bind(this))
      .on('tree:show', function () {
        this.setState({ treeHidden: false })
      }.bind(this))
      .on('tree:hide', function () {
        this.setState({ treeHidden: true })
      }.bind(this))
    // this.refs.scrollable && PerfectScrollbar.initialize(ReactDOM.findDOMNode(this.refs.scrollable))
  },
  render: function () {
    let element = false
    if (this.state.elementId) {
      var data = this.props.api.getService('document').get(this.state.elementId)
      element = cook.get(data)
    }
    let treeViewClasses = classNames({
      'vcv-ui-tree-view-container': true,
      'vcv-ui-tree-view-o-content-expand': this.state.elementId !== false
    })
    let treeViewLayoutClasses = classNames({
      'vcv-ui-tree-view-layout': true,
      'vcv-hidden': this.state.treeHidden
    })

    let treeViewLayoutResizerClasses = classNames({
      'vcv-ui-resizer': true,
      'vcv-ui-resizer-x': true,
      'vcv-ui-resizer-tree-view-layout': true,
      'vcv-ui-resizer-tree-view-layout-hidden': this.state.treeHidden
    })

    return (
      <div id="vcv-ui-tree-view-container">
        <div className={treeViewClasses}>
          <div ref="scrollable" className={treeViewLayoutClasses}>
            <TreeLayout api={this.props.api} />
          </div>
          <div className={treeViewLayoutResizerClasses}></div>
          <div className="vcv-ui-tree-view-content">
            <EditElement element={element} api={this.props.api} />
          </div>
          <div className="vcv-ui-resizer vcv-ui-resizer-y vcv-ui-resizer-tree-view-container"></div>
          <div className="vcv-ui-resizer vcv-ui-resizer-xy vcv-ui-resizer-tree-view"></div>
        </div>
      </div>
    )
  }
})
module.exports = TreeView
