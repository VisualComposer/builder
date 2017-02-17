import React from 'react'
import classNames from 'classnames'

export default class RowPlaceholderControl extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    action: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    options: React.PropTypes.any
  }

  handleClick (action, e) {
    e && e.preventDefault()
    let options = this.props.options === 'true' ? true : this.props.options
    this.props.api.request(action, options)
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
      onClick={this.handleClick.bind(this, this.props.action)}
    >
      <span className='vcv-row-control-content'>
        <i className={controlIconClasses} />
        <span>{this.props.text}</span>
      </span>
    </a>
  }
}
