/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-tree-layout', function (api) {
  var React = require('react')
  var classNames = require('classnames')
  var Control = React.createClass({
    getInitialState: function () {
      return {
        menuExpand: false,
        data: []
      }
    },
    componentDidMount: function () {
      api.on('show', function () {
        this.setState({ menuExpand: true })
      }.bind(this))
        .on('hide', function () {
          this.setState({ menuExpand: false })
        }.bind(this))
    },
    toggleTreeView: function (e) {
      e.preventDefault()
      if (this.state.menuExpand) {
        api.notify('hide')
      } else {
        api.notify('show')
      }
    },
    render: function () {
      let controlClass = classNames({
        'vc-ui-navbar-control': true,
        'vc-ui-navbar-control-active': this.state.menuExpand
      })
      return <a className={controlClass} href="#" title="Tree View" onClick={this.toggleTreeView}><span
        className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-layers"></i><span>Tree View</span></span></a>
    }
  })
  api.module('ui-navbar').do('addElement', 'Tree layout', Control, 'left')
})

