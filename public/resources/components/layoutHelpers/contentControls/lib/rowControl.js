import React from 'react'
import vcCake from 'vc-cake'

const assetsManager = vcCake.getService('assetsManager')

export default class RowControl extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
    action: React.PropTypes.string.isRequired,
    options: React.PropTypes.any.isRequired
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e && e.preventDefault()
    this.props.api.request(this.props.action, this.props.id, this.props.options)
  }

  render () {
    const { title, icon } = this.props

    return <span
      className='vcv-ui-blank-row-element-control'
      title={title}
      onClick={this.handleClick}>
      <img
        className='vcv-ui-blank-row-element-control-icon'
        src={assetsManager.getSourcePath(`images/blankRowPlaceholderIcons/${icon}`)}
        alt={title}
      />
      <span className='vcv-ui-blank-row-element-control-label'>{title}</span>
    </span>
  }
}
