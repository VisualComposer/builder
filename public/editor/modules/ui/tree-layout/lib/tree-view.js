/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var classNames = require('classnames')

var TreeLayout = require('./tree-layout')

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
      contentComponent: null,
      contentProps: {},
      contentHidden: true
    }
  },
  componentDidMount: function () {
    // Chane react component state
    this.props.api.addAction('setContent', (Component, props = {}) => {
      this.setState({
        contentComponent: Component,
        contentProps: props
      })
    })
    this.props.api
      .on('hide', function () {
        this.setState({ contentComponent: null, contentProps: null })
      }.bind(this))
      .on('form:hide', function () {
        this.setState({ contentComponent: null, contentProps: null })
      }.bind(this))
      .on('tree:toggle', function () {
        this.setState({ treeHidden: !this.state.treeHidden })
      }.bind(this))
      .on('tree:show', function () {
        this.setState({ treeHidden: false })
      }.bind(this))
      .on('content:show', () => {
        this.setState({ contentHidden: false })
      })
      .on('content:hide', () => {
        this.setState({ contentHidden: true })
      })
      .on('tree:hide', function () {
        this.setState({ treeHidden: true })
      }.bind(this))
    // this.refs.scrollable && PerfectScrollbar.initialize(ReactDOM.findDOMNode(this.refs.scrollable))
  },
  render: function () {
    let treeViewClasses = classNames({
      'vcv-ui-tree-view-container': true,
      'vcv-ui-tree-view-o-content-expand': this.state.contentHidden === false
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
    let content = null
    if (this.state.contentComponent) {
      content = React.createElement(this.state.contentComponent, this.state.contentProps)
    }
    return (
      <div id="vcv-ui-tree-view-container">
        <div className={treeViewClasses}>
          <div ref="scrollable" className={treeViewLayoutClasses}>
            <TreeLayout api={this.props.api}/>
          </div>
          <div className={treeViewLayoutResizerClasses}></div>
          <div className="vcv-ui-tree-view-content">
            {content}
          </div>
          <div className="vcv-ui-resizer vcv-ui-resizer-y vcv-ui-resizer-tree-view-container"></div>
          <div className="vcv-ui-resizer vcv-ui-resizer-xy vcv-ui-resizer-tree-view"></div>
        </div>
      </div>
    )
  }
})
module.exports = TreeView
