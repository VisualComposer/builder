import React from 'react'
import classNames from 'classnames'

export default class TemplateTab extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    active: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    changeActive: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e && e.preventDefault()
    this.props.changeActive(this.props.index)
  }

  render () {
    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': this.props.active === this.props.index
    })

    return (
      <a
        className={tabClasses}
        href='#'
        onClick={this.handleClick}
      >
        <span className='vcv-ui-editor-tab-content'>
          <span>{this.props.title}</span>
        </span>
      </a>
    )
  }
}
