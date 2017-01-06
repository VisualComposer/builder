import React from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
const categories = getService('categories')

export default class DefaultElement extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      activeAttribute: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ activeAttribute: !this.state.activeAttribute })
  }

  render () {
    let icon = categories.getElementIcon(this.props.element.tag)
    let attributesClasses = classNames({
      'vce-wpbackend-element-attributes': true,
      'vce-wpbackend-hidden': !this.state.activeAttribute
    })

    let headerClasses = classNames({
      'vce-wpbackend-element-header': true,
      'vce-wpbackend-element-header-closed': !this.state.activeAttribute,
      'vce-wpbackend-element-header-opened': this.state.activeAttribute
    })

    return <div className='vce-wpbackend-element-container'>
      <div className={headerClasses} onClick={this.handleClick}>
        <div className='vce-wpbackend-element-header-icon'>
          <img src={icon} alt={this.props.element.name} />
        </div>
        <div className='vce-wpbackend-element-header-name'>{this.props.element.name}</div>
      </div>
      <div className={attributesClasses}>Attributes</div>
    </div>
  }
}
