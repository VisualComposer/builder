import React from 'react'
import classNames from 'classnames'

export default class RowControl extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired,
    action: React.PropTypes.string.isRequired
  }

  handleClick (action, e) {
    e && e.preventDefault()
    if (!this.props.disabled) {
      this.props.api.request(action, this.props.id)
    }
  }

  render () {
    let controlIconClasses = classNames(
      'vcv-row-control-icon',
      'vcv-ui-icon',
      `vcv-ui-icon-${this.props.icon}`
    )

    return <a
      className='vcv-row-control'
      href='#'
      title={this.props.title}
      disabled={this.props.disabled}
      onClick={this.handleClick.bind(this, this.props.action)}>
      <span className='vcv-row-control-content'>
        <i className={controlIconClasses} />
        <span>{this.props.text}</span>
      </span>
    </a>
  }
}
