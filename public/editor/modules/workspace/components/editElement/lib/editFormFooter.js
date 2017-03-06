import React from 'react'
import classNames from 'classnames'
// import {setData} from 'vc-cake'

export default class EditFormFooter extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired
  }
  state = {
    saving: false,
    saved: false
  }

  onSave = () => {
    let { element } = this.props
    let elementData = element.toJS()
    delete elementData.order
    delete elementData.parent
    // api.request('data:update', element.get('id'), elementData)
    this.effect()
  }
  componentDidMount () {
    this.canceled = false
  }
  componentWillUnmount () {
    this.canceled = true
  }
  effect () {
    this.setState({ 'saving': true })
    setTimeout(() => {
      this.setState({ 'saving': false })
      this.setState({ 'saved': true })
      setTimeout(() => {
        !this.canceled && this.setState({ 'saved': false })
      }, 1000)
    }, 500)
  }

  render () {
    let saveButtonClasses = classNames({
      'vcv-ui-edit-form-action': true,
      'vcv-ui-state--success': this.state.saved
    })
    let saveIconClasses = classNames({
      'vcv-ui-edit-form-action-icon': true,
      'vcv-ui-wp-spinner': this.state.saving,
      'vcv-ui-icon': !this.state.saving,
      'vcv-ui-icon-save': !this.state.saving
    })

    return (
      <div className='vcv-ui-edit-form-content-footer'>
        <div className='vcv-ui-edit-form-actions'>
          <a className={saveButtonClasses} title='Save' onClick={this.onSave}>
            <span className='vcv-ui-edit-form-action-content'>
              <i className={saveIconClasses} />
              <span>Save</span>
            </span>
          </a>
        </div>
      </div>
    )
  }
}
