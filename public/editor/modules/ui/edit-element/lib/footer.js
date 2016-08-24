import React from 'react'
import classNames from 'classnames'

class EditFormFooter extends React.Component {
  static propTypes = {
    onSave: React.PropTypes.func.isRequired,
    saving: React.PropTypes.bool.isRequired,
    saved: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !(
      this.props.saving === nextProps.saving &&
      this.props.saved === nextProps.saved
    )
  }

  render () {
    let saveButtonClasses = classNames({
      'vcv-ui-tree-layout-action': true,
      'vcv-ui-state--success': this.props.saved
    })
    let saveIconClasses = classNames({
      'vcv-ui-tree-layout-action-icon': true,
      'vcv-ui-wp-spinner': this.props.saving,
      'vcv-ui-icon': !this.props.saving,
      'vcv-ui-icon-save': !this.props.saving
    })

    return (
      <div className='vcv-ui-tree-content-footer'>
        <div className='vcv-ui-tree-layout-actions'>
          <a className={saveButtonClasses} href='#' title='Save' onClick={this.props.onSave}>
            <span className='vcv-ui-tree-layout-action-content'>
              <i className={saveIconClasses} />
              <span>Save</span>
            </span>
          </a>
        </div>
      </div>
    )
  }
}

export default EditFormFooter
