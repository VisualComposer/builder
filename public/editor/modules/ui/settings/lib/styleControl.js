import React from 'react'
import classNames from 'classnames'

export default class StyleControl extends React.Component {
  handleClick () {
    this.props.changeActive(this.props.index)
  }

  render () {
    let { title, active } = this.props

    let controlClass = classNames({
      'vcv-ui-style-control': true,
      'vcv-ui-style-control--active': active
    })
    return (
      <button className={controlClass} onClick={this.handleClick.bind(this)}>
        {title}
      </button>
    )
  }
}
StyleControl.propTypes = {
  changeActive: React.PropTypes.func,
  index: React.PropTypes.number.isRequired,
  title: React.PropTypes.string,
  active: React.PropTypes.bool
}
