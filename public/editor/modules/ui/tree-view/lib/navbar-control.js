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
        .on('show', function () {
          this.setState({ controlActive: true })
        }.bind(this))
        .on('hide', function () {
          this.setState({ controlActive: false })
        }.bind(this))
        .reply('tree-view:hide', () => {
          this.setState({ controlActive: false })
        })
        .reply('tree-view:show', () => {
          this.setState({ controlActive: true })
        })
    },
    toggleTreeView: function (e) {
      e && e.preventDefault()
      if (this.state.controlActive) {
        api.notify('hide')
        // api.request('tree-view:hide')
      } else {
        api.notify('show')
        // api.request('tree-view:show')
        // api.notify('tree:show')
        // api.notify('content:hide')
        // api.notify('show')
      }
    },
    render: function () {
      let controlClass = classNames({
        'vcv-ui-navbar-control': true,
        'vcv-ui-state--active': this.state.controlActive
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

