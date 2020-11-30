import React from 'react'
import classNames from 'classnames'
import Content from './contentParts/content'
import HubContainer from './hub/hubContainer'
import TreeViewLayout from './treeView/treeViewLayout'
import SettingsPanel from './settings/settingsPanel'
import InsightsPanel from './insights/insightsPanel'
import EditFormPanel from './editForm/lib/activitiesManager'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'
import AddContentPanel from './addContent/addContentPanel'

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

    const response = []
    if (PanelsContainer.openedPanels.treeView) {
      response.push(
        <TreeViewLayout
          key='panels-container-treeView'
          treeViewId={treeViewId}
          visible={content === 'treeView'}
        />
      )
    }
    if (PanelsContainer.openedPanels.addElement) {
      response.push(
        <AddContentPanel
          key='panels-container-addElement'
          options={settings || { parent: {} }}
          activeTab='addElement'
          visible={content === 'addElement'}
        />
      )
    }
    if (PanelsContainer.openedPanels.addTemplate) {
      response.push(
        <AddContentPanel
          key='panels-container-addTemplate'
          options={settings || { parent: {} }}
          activeTab='addTemplate'
          visible={content === 'addTemplate'}
        />
      )
    }
    if (PanelsContainer.openedPanels.addHubElement) {
      const workspaceState = workspaceStorage.state('settings').get()
      let options = {}
      if (workspaceState && workspaceState.options && workspaceState.options.filterType) {
        options = workspaceState.options
      }
      response.push(
        <HubContainer
          key='panels-container-addHubElement'
          parent={{}}
          options={options}
          namespace='editor'
          visible={content === 'addHubElement'}
        />
      )
    }
    if (PanelsContainer.openedPanels.insights) {
      response.push(<InsightsPanel key='panels-container-insights' visible={content === 'insights'} />)
    }
    if (PanelsContainer.openedPanels.settings) {
      response.push(<SettingsPanel key='panels-container-settings' visible={content === 'settings'} />)
    }
    if (PanelsContainer.openedPanels.editElement && settings && settings.elementAccessPoint) {
      const activeTabId = settings.activeTab || ''
      response.push(
        <EditFormPanel
          key={`panels-container-editElement-${settings.elementAccessPoint.id}`}
          elementAccessPoint={settings.elementAccessPoint}
          activeTabId={activeTabId}
          options={settings.options || {}}
          visible={content === 'editElement'}
        />
      )
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
