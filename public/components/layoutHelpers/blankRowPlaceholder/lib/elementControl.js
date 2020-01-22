import React from 'react'
import PropTypes from 'prop-types'

export default class ElementControl extends React.Component {
  static propTypes = {
    control: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e && e.preventDefault()
    this.props.handleClick(this.props.control)
  }

  render () {
    const { options } = this.props.control

    return (
      <span
        className='vcv-ui-blank-row-element-control'
        title={options.title}
        onClick={this.handleClick}
      >
        <span
          className='vcv-ui-blank-row-element-control-icon'
          dangerouslySetInnerHTML={{ __html: options.icon }}
          alt={options.title}
        />
        <span className='vcv-ui-blank-row-element-control-label'>{options.title}</span>
      </span>
    )
  }
}
