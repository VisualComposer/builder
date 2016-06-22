/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-tree-layout', function (api) {
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
        .on('hide', function () {
          this.setState({ controlActive: false })
        }.bind(this))
        .reply('tree-layout:hide', () => {
          this.setState({ controlActive: false })
        })
        .reply('tree-layout:show', () => {
          this.setState({ controlActive: true })
        })
    },
    toggleTreeView: function (e) {
      e.preventDefault()
      if (this.state.controlActive) {
        this.setState({ controlActive: false })
        api.request('tree-layout:hide')
      } else {
        this.setState({ controlActive: true })
        api.notify('tree:show')
        api.notify('content:hide')
        api.request('show')
      }
    },
    render: function () {
      let controlClass = classNames({
        'vcv-ui-navbar-control': true,
        'vcv-ui-navbar-control-active': this.state.controlActive
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

