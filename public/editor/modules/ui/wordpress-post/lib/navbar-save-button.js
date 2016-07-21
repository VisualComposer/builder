/*eslint jsx-quotes: [2, "prefer-double"]*/
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
        'vcv-ui-navbar-control': true,
        'vcv-ui-state--success': this.state.saved
      })
      var saveIconClasses = classNames({
        'vcv-ui-navbar-control-icon': true,
        'vcv-ui-wp-spinner': this.state.saving,
        'vcv-ui-icon': !this.state.saving,
        'vcv-ui-icon-save': !this.state.saving
      })
      return (<div className="vcv-ui-navbar-controls-group vcv-ui-pull-end">
        <a className={saveButtonClasses} title="Save" onClick={this.clickSaveData}><span className="vcv-ui-navbar-control-content">
          <i className={saveIconClasses}></i><span>Save</span>
        </span></a>
      </div>)
    }
  })
  api.module('ui-navbar').do('addElement', 'Save post', Control, { pin: 'visible' })
})
