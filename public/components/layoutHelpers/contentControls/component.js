import React from 'react'
import RowControl from './lib/rowControl'
import vcCake from 'vc-cake'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')

export default class ContentControls extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  }

  container = null

  constructor (props) {
    super(props)
    this.state = {
      hideIcon: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      this.isMobile = true
    }
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
    // TODO: Check this
    const element = vcCake.getService('document').get(this.props.id)
    let options = ''
    const children = vcCake.getService('cook').getContainerChildren(element.tag)
    if (children.length === 1) {
      options = children[ 0 ].tag
    }
    workspaceStorage.trigger('add', this.props.id, options)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    let classes = 'vcvhelper vcv-row-control-container vcv-row-control-container-hide-labels vcv-is-disabled-outline'
    if (this.isMobile) {
      classes += ' vcv-row-control-container-mobile-add'
    }

    return <div
      className={classes}
      title={addElementText}
      onClick={this.handleClick}
      onMouseEnter={this.handleMouseEnter}
      ref={(container) => { this.container = container }}
    >
      <RowControl
        ref={(icon) => { this.icon = icon }}
        hideIcon={this.state.hideIcon}
      />
    </div>
  }
}
