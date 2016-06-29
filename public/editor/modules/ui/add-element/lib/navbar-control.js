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
    componentDidMount: function () {
      api
        .on('show', function () {
          this.setState({ isWindowOpen: true })
        }.bind(this))
        .on('hide', function () {
          this.setState({ isWindowOpen: false })
        }.bind(this))
    },
    toggleAddElement: function (e) {
      e && e.preventDefault()
      if (this.state.isWindowOpen) {
        api.notify('hide')
      } else {
        api.notify('show')
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
  api.module('ui-navbar').do('addElement', 'Add element', Control, 'left')
})
