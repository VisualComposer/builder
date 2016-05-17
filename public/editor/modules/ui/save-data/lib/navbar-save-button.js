/*eslint jsx-quotes: ["error", "prefer-double"]*/
var vcCake = require('vc-cake')
vcCake.add('ui-save-data', function (api) {
  var React = require('react')
  var classNames = require('classnames')
  var Control = React.createClass({
    getInitialState: function () {
      return {
        saving: false
      }
    },
    clickSaveData: function () {
      var _this = this
      this.setState({ 'saving': true })
      setTimeout(function () {
        _this.setState({ 'saving': false })
        _this.setState({ 'saved': true })
      }, 500)
      setTimeout(function () {
        _this.setState({ 'saved': false })
      }, 5000)
      api.notify('save')
    },
    render: function () {
      var saveButtonClasses = classNames({
        'vc-ui-navbar-control': true,
        'vc-ui-state-success': this.state.saved
      })
      var saveIconClasses = classNames({
        'vc-ui-navbar-control-icon': true,
        'vc-ui-wp-spinner': this.state.saving,
        'vc-ui-icon': !this.state.saving,
        'vc-ui-icon-save': !this.state.saving
      })
      return <div className="vc-ui-navbar-controls-group vc-ui-pull-end">
        <a className={saveButtonClasses} title="Save" onClick={this.clickSaveData}><span className="vc-ui-navbar-control-content">
          <i className={saveIconClasses}></i><span>Save</span>
        </span></a>
      </div>
    }
  })
  api.module('ui-navbar').do('addElement', 'Save post', Control, 'right')
})
