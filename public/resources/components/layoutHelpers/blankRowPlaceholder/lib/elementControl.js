import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assetsManager')

export default class ElementControl extends React.Component {
  static propTypes = {
    control: React.PropTypes.object.isRequired,
    handleClick: React.PropTypes.func.isRequired
  }

  render () {
    let { tag, options } = this.props.control
    let controlClass = classNames([
      'vcv-ui-blank-row-element-control',
      `vcv-ui-blank-row-element-control--${tag}`
    ])
    return <button
      className={controlClass}
      title={options.title}
      onClick={this.props.handleClick.bind(null, this.props.control)}
    >
      <img
        className='vcv-ui-blank-row-element-control-icon'
        src={assetsManager.getSourcePath(`images/blankRowPlaceholderIcons/${options.icon}`)}
        alt={options.title}
      />
      <span className='vcv-ui-blank-row-element-control-label'>{options.title}</span>
    </button>
  }
}

