/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-add-element', function (api) {
  var React = require('react')
  var classNames = require('classnames')
  var Control = React.createClass({
    getInitialState: function () {
      return {
        isWindowOpen: false
      }
    },
    componentWillMount: function () {
      api
        .on('show', () => {
          this.setState({ isWindowOpen: true })
        })
        .on('hide', () => {
          this.setState({ isWindowOpen: false })
        })
        .reply('app:edit', () => {
          this.setState({ isWindowOpen: false })
        })
    },
    componentWillUnmount: function () {
      api
        .off('show', () => {
          this.setState({ isWindowOpen: true })
        })
        .off('hide', () => {
          this.setState({ isWindowOpen: false })
        })
        .forget('app:edit', () => {
          this.setState({ isWindowOpen: false })
        })
    },
    toggleAddElement: function (e) {
      e && e.preventDefault()
      if (this.state.isWindowOpen) {
        api.notify('hide')
        api.request('bar-content-start:hide')
      } else {
        api.request('app:add', null)
      }
    },
    render: function () {
      let controlClass = classNames({
        'vcv-ui-navbar-control': true,
        'vcv-ui-state--active': this.state.isWindowOpen
      })
      return <a className={controlClass} href="#" title="Add Element" onClick={this.toggleAddElement}>
        <span className="vcv-ui-navbar-control-content">
          <i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add"></i>
          <span>Add Element</span>
        </span>
      </a>
    }
  })
  api.module('ui-navbar').do('addElement', 'Add element', Control, { pin: 'visible' })
})
