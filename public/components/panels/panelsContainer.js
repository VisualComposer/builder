import React from 'react'
import classNames from 'classnames'
import Content from './contentParts/content'
import AddElementPanel from './addElement/addElementPanel'
import TeaserAddElementCategories from './teaserAddElement/lib/teaserCategories'
import AddTemplatePanel from './addTemplate/addTemplatePanel'
import TreeViewLayout from './treeView/treeViewLayout'
import SettingsPanel from './settings/settingsPanel'
import EditFormPanel from './editForm/lib/activitiesManager'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

export default class PanelsContainer extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    settings: PropTypes.object,
    treeViewId: PropTypes.string
  }

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
    const { content, settings } = this.props
    if (content === 'treeView') {
      return null
    } else if (content === 'addElement') {
      return <AddElementPanel options={settings || {}} />
    } else if (content === 'addHubElement') {
      return (
        <TeaserAddElementCategories parent={{}} />
      )
    } else if (content === 'addTemplate') {
      return <AddTemplatePanel />
    } else if (content === 'settings') {
      return <SettingsPanel />
    } else if (content === 'editElement') {
      // TODO: Check content = editElement
      if (settings && settings.elementAccessPoint) {
        const activeTabId = settings.activeTab || ''
        return <EditFormPanel key={`panels-container-edit-element-${settings.elementAccessPoint.id}`} elementAccessPoint={settings.elementAccessPoint} activeTabId={activeTabId} options={settings.options || {}} />
      }
    }
  }

  render () {
    const { content, treeViewId } = this.props
    const layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': !!content,
      'vcv-layout-bar-content-mobile': this.isMobile
    })
    const layoutStyle = {}

    if (this.isMobile) {
      layoutStyle.height = this.state.height
    }

    const treeViewLayout = <TreeViewLayout treeViewId={treeViewId} visible={content === 'treeView'} />

    return (
      <div className={layoutClasses} style={layoutStyle} ref={this.props.wrapperRef}>
        <Content content={content}>
          {treeViewLayout}
          {this.getContent()}
        </Content>
      </div>
    )
  }
}
