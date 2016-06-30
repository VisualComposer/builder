/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-tree-view', function (api) {
  var React = require('react')
  var classNames = require('classnames')
  var Control = React.createClass({
    getInitialState: function () {
      return {
        controlActive: false,
        data: []
      }
    },
    componentDidMount: function () {
      api
        .reply('bar-content-start:show', function () {
          this.setState({ controlActive: true })
        }.bind(this))
        .reply('bar-content-start:hide', function () {
          this.setState({ controlActive: false })
        }.bind(this))
    },
    toggleTreeView: function (e) {
      e && e.preventDefault()
      if (this.state.controlActive) {
        api.notify('hide')
      } else {
        api.notify('show')
      }
    },
    render: function () {
      let controlClass = classNames({
        'vcv-ui-navbar-control': true,
        'vcv-ui-toggle--inactive': !this.state.controlActive,
        'vcv-ui-toggle--active': this.state.controlActive
      })
      return <a className={controlClass} href="#" title="Tree View" onClick={this.toggleTreeView}>
        <span className="vcv-ui-navbar-control-content">
          <i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers"></i>
          <span>Tree View</span>
        </span>
      </a>
    }
  })
  api.module('ui-navbar').do('addElement', 'Tree layout', Control, 'left')
})

