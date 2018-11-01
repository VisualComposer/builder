import React from 'react'
import classNames from 'classnames'
import Content from 'public/resources/components/contentParts/content'
import AddElementPanel from 'public/resources/components/addElement/addElementPanel'
import TeaserAddElementCategories from 'public/resources/components/teaserAddElement/lib/teaserCategories'
import AddTemplatePanel from 'public/resources/components/addTemplate/addTemplatePanel'
import TreeViewLayout from 'public/resources/components/treeView/treeViewLayout'
import SettingsPanel from 'public/resources/components/settings/settingsPanel'
import EditFormPanel from 'public/resources/components/editForm/editFormPanel'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

export default class PanelsContainer extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    settings: PropTypes.object,
    contentId: PropTypes.string
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
      if (settings && settings.element) {
        const activeTabId = settings.tag || ''
        return <EditFormPanel key={`panels-container-edit-element-${settings.element.id}`} element={settings.element} activeTabId={activeTabId} options={settings.options || {}} />
      }
    }
  }

  render () {
    const { content, contentId } = this.props
    let layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': !!content,
      'vcv-layout-bar-content-mobile': this.isMobile
    })
    let layoutStyle = {}

    if (this.isMobile) {
      layoutStyle.height = this.state.height
    }

    let treeViewLayout = <TreeViewLayout contentId={contentId} visible={content === 'treeView'} />

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
