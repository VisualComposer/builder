/*eslint jsx-quotes: ["error", "prefer-double"]*/
var vcCake = require('vc-cake')
var React = require('react')
var classNames = require('classnames')

var TreeLayout = require('./tree-layout')
var EditElement = require('./edit-element/form')

const cook = vcCake.getService('cook')

require('../css/tree-view/init.less')

var TreeView = React.createClass({
  propTypes: {
    api: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      treeContentCount: 0,
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
  },
  render: function () {
    let element = false
    if (this.state.elementId) {
      var data = this.props.api.getService('document').get(this.state.elementId)
      element = cook.get(data)
    }
    var treeViewClasses = classNames({
      'vc-ui-tree-view-container': true,

      'vc-ui-tree-view-o-content-expand': this.state.elementId !== false
    })
    return (
      <div id="vc-ui-tree-view-container">
        <div className={treeViewClasses}>
          <div className="vc-ui-tree-view-layout">
            <TreeLayout api={this.props.api} />
          </div>
          <div className="vc-ui-tree-view-content">
            <EditElement element={element} api={this.props.api} />
          </div>
        </div>
      </div>
    )
  }
})
module.exports = TreeView
