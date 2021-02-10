import React from 'react'
import classNames from 'classnames'
import Content from './contentParts/content'
import EditFormPanel from './editForm/lib/activitiesManager'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'

const workspaceStorage = vcCake.getStorage('workspace')

export default class PanelsContainer extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    settings: PropTypes.object,
    treeViewId: PropTypes.string
  }

  static openedPanels = {}

  constructor (props) {
    super(props)
    this.state = {
      height: window.innerHeight - 60
    }
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      this.isMobile = true
    }

    this.updateOnResize = this.updateOnResize.bind(this)
  }

  componentDidMount () {
    if (this.isMobile) {
      window.addEventListener('resize', this.updateOnResize)
    }

    innerAPI.mount('panel:editElement', (props) => { return <EditFormPanel key={`panels-container-editElement-${props.elementAccessPoint.id}`} {...props} /> })
  }

  componentWillUnmount () {
    if (this.isMobile) {
      window.removeEventListener('resize', this.updateOnResize)
    }
  }

  updateOnResize () {
    this.setState({
      height: window.innerHeight - 60
    })
  }

  getContent () {
    const { content, settings, treeViewId } = this.props
    PanelsContainer.openedPanels[content] = true
    const props = {}
    const response = []
    if (PanelsContainer.openedPanels.treeView) {
      props.visible = content === 'treeView'
      props.treeViewId = treeViewId
      response.push(innerAPI.pick('panel:treeView', null, props))
    }
    if (PanelsContainer.openedPanels.addElement) {
      props.visible = content === 'addElement'
      props.options = settings || { parent: {} }
      response.push(innerAPI.pick('panel:addElement', null, props))
    }
    if (PanelsContainer.openedPanels.addTemplate) {
      props.visible = content === 'addTemplate'
      props.options = settings || { parent: {} }
      response.push(innerAPI.pick('panel:addTemplate', null, props))
    }
    if (PanelsContainer.openedPanels.addHubElement) {
      const workspaceState = workspaceStorage.state('settings').get()
      if (workspaceState && workspaceState.options && workspaceState.options.filterType) {
        props.options = workspaceState.options
      }
      props.visible = content === 'addHubElement'
      response.push(innerAPI.pick('panel:addHubElement', null, props))
    }
    if (PanelsContainer.openedPanels.insights) {
      props.visible = content === 'insights'
      response.push(innerAPI.pick('panel:insights', null, props))
    }
    if (PanelsContainer.openedPanels.settings) {
      props.visible = content === 'settings'
      response.push(innerAPI.pick('panel:settings', null, props))
    }
    if (PanelsContainer.openedPanels.editElement && settings && settings.elementAccessPoint) {
      props.visible = content === 'editElement'
      props.options = settings.options || {}
      props.activeTabId = settings.activeTab || ''
      props.elementAccessPoint = settings.elementAccessPoint
      response.push(innerAPI.pick('panel:editElement', null, props))
    }

    return response
  }

  render () {
    const { content } = this.props
    const layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': !!content,
      'vcv-layout-bar-content-mobile': this.isMobile,
      'vcv-content-full-size': this.props.content === 'addHubElement'
    })
    const layoutStyle = {}

    if (this.isMobile) {
      layoutStyle.height = this.state.height
    }

    return (
      <div className={layoutClasses} style={layoutStyle} ref={this.props.wrapperRef}>
        <Content content={content}>
          {this.getContent()}
        </Content>
      </div>
    )
  }
}
