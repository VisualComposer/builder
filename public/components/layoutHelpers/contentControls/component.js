import React from 'react'
import RowControl from './lib/rowControl'
import vcCake from 'vc-cake'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const dataManager = vcCake.getService('dataManager')

export default class ContentControls extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      this.isMobile = true
    }
    this.container = React.createRef()
  }

  componentDidMount () {
    this.container.current.closest('.vce-col').setAttribute('data-vcv-centered-control', true)
    this.container.current.closest('.vce-col-inner').setAttribute('data-vcv-centered-control', true)
    this.container.current.closest('.vce-col-content').setAttribute('data-vcv-centered-control', true)
  }

  componentWillUnmount () {
    this.container.current.closest('.vce-col').removeAttribute('data-vcv-centered-control')
    this.container.current.closest('.vce-col-inner').removeAttribute('data-vcv-centered-control')
    this.container.current.closest('.vce-col-content').removeAttribute('data-vcv-centered-control')
  }

  handleClick () {
    // TODO: Check this
    const element = vcCake.getService('document').get(this.props.id)
    let options = ''
    const children = vcCake.getService('cook').getContainerChildren(element.tag)
    if (children.length === 1) {
      options = children[0].tag
    }
    workspaceStorage.trigger('add', this.props.id, options)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    let classes = 'vcvhelper vcv-row-control-container vcv-row-control-container-hide-labels vcv-is-disabled-outline'
    if (this.isMobile) {
      classes += ' vcv-row-control-container-mobile-add'
    }

    return (
      <div
        className={classes}
        title={addElementText}
        onClick={this.handleClick}
        ref={this.container}
      >
        <RowControl />
      </div>
    )
  }
}
