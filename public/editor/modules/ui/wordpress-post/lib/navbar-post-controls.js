var vcCake = require('vc-cake')
var React = require('react')
var classNames = require('classnames')
require('../../../../../sources/less/ui/loader/init.less')

class WordPressPostSaveControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      saving: false
    }
  }

  clickSaveData () {
    this.setState({ 'saving': true })
    setTimeout((() => {
        this.setState({ 'saving': false })
        this.setState({ 'saved': true })
      }).bind(this), 500
    )
    setTimeout((() => {
        this.setState({ 'saved': false })
      }).bind(this), 5000
    )
    this.props.api.notify('save')
  }

  render () {
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
    return (
      <div className="vcv-ui-navbar-controls-group vcv-ui-pull-end">
        <a className={saveButtonClasses} title="Save" onClick={this.clickSaveData.bind(this)}><span
          className="vcv-ui-navbar-control-content">
          <i className={saveIconClasses}></i><span>Save</span>
        </span></a>
      </div>
    )
  }
}

class WordPressAdminControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = window.vcvPostData
  }

  render () {
    var saveDraftButton = ''
    if (
      this.state.status !== 'publish' &&
      this.state.status !== 'future' &&
      this.state.status !== 'pending' &&
      this.state.status !== 'private'
    ) {
      saveDraftButton = (
        <a className="vcv-ui-navbar-control" href={this.state.permalink} title="Save Draft"><span
          className="vcv-ui-navbar-control-content">Save Draft</span></a>
      )
    }

    var viewButton = ''
    if (this.state.status === 'publish') {
      viewButton = (
        <a className="vcv-ui-navbar-control" href={this.state.permalink} title="View Page"><span
          className="vcv-ui-navbar-control-content">View Page</span></a>
      )
    }
    var previewText = this.state.status === 'publish' ? 'Preview Changes' : 'Preview'
    var previewButton = (
      <a className="vcv-ui-navbar-control" href={this.state.previewUrl} title={previewText}><span
        className="vcv-ui-navbar-control-content">{previewText}</span></a>
    )

    return (
      <div>
        {saveDraftButton}
        {previewButton}
        {viewButton}
      </div>
    )
  }
}

vcCake.add('ui-wordpress-navbar-wp-admin',
  (api) => {
    api.module('ui-navbar').do('addElement', 'Wordpress Post Save Button', <WordPressPostSaveControl api={api} />,
      {
        pin: 'visible'
      }
    )
    api.module('ui-navbar').do('addElement', 'Wordpress Admin Controls', WordPressAdminControl,
      {
        pin: 'hidden'
      }
    )
  }
)

