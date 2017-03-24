import React from 'react'
import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assetsManager')

export default class ElementControl extends React.Component {
  static propTypes = {
    control: React.PropTypes.object.isRequired,
    handleClick: React.PropTypes.func.isRequired
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
    let { options } = this.props.control

    return <span
      className='vcv-ui-blank-row-element-control'
      title={options.title}
      onClick={this.handleClick}
    >
      <img
        className='vcv-ui-blank-row-element-control-icon'
        src={assetsManager.getSourcePath(`images/blankRowPlaceholderIcons/${options.icon}`)}
        alt={options.title}
      />
      <span className='vcv-ui-blank-row-element-control-label'>{options.title}</span>
    </span>
  }
}

