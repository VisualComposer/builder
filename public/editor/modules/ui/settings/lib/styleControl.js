import React from 'react'
import classNames from 'classnames'

export default class StyleControl extends React.Component {
  static propTypes = {
    changeActive: React.PropTypes.func,
    index: React.PropTypes.number.isRequired,
    title: React.PropTypes.string,
    active: React.PropTypes.bool
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
    let { title, active } = this.props

    let controlClass = classNames({
      'vcv-ui-style-control': true,
      'vcv-ui-state--active': active
    })
    return (
      <button className={controlClass} onClick={this.handleClick}>
        {title}
      </button>
    )
  }
}
