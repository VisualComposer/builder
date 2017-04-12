import React from 'react'
import RowControl from './lib/rowControl'
import vcCake from 'vc-cake'

const workspaceStorage = vcCake.getStorage('workspace')

export default class ContentControls extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired
  }

  container = null

  constructor (props) {
    super(props)
    this.state = {
      hideIcon: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
  }

  handleMouseEnter () {
    const image = this.container.querySelector('.vcv-ui-blank-row-element-control-icon')
    if (image.getBoundingClientRect().width > this.container.getBoundingClientRect().width && !this.state.hideIcon) {
      this.setState({ hideIcon: true })
    }
    if (image.getBoundingClientRect().width < this.container.getBoundingClientRect().width && this.state.hideIcon) {
      this.setState({ hideIcon: false })
    }
  }

  handleClick () {
    const element = vcCake.getService('document').get(this.props.id)
    let options = ''
    const children = vcCake.getService('cook').getChildren(element.tag)
    if (children.length === 1) {
      options = children[0].tag
    }
    // this.props.api.request('app:add', this.props.id, options)
    workspaceStorage.trigger('add', this.props.id, options)
  }

  render () {
    return <vcvhelper
      className='vcv-row-control-container vcv-row-control-container-hide-labels vcv-is-disabled-outline'
      title='Add Element'
      onClick={this.handleClick}
      onMouseEnter={this.handleMouseEnter}
      ref={(container) => { this.container = container }}
    >
      <RowControl
        ref={(icon) => { this.icon = icon }}
        hideIcon={this.state.hideIcon}
      />
    </vcvhelper>
  }
}
