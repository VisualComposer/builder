import React from 'react'
import classNames from 'classnames'
import Content from '../../../../resources/components/contentParts/content'
import ContentStart from '../../../../resources/components/contentParts/contentStart'
import ContentEnd from '../../../../resources/components/contentParts/contentEnd'
import AddElementPanel from '../../../../resources/components/addElement/addElementPanel'
import TeaserAddElementCategories from '../../../../resources/components/teaserAddElement/lib/teaserCategories'
import AddTemplatePanel from '../../../../resources/components/addTemplate/addTemplatePanel'
import TreeViewLayout from '../../../../resources/components/treeView/treeViewLayout'
import SettingsPanel from '../../../../resources/components/settings/settingsPanel'
import EditElementPanel from '../../../../resources/components/editElement/editElementPanel'
import {getService, env} from 'vc-cake'
import MobileDetect from 'mobile-detect'

const cook = getService('cook')

export default class PanelsContainer extends React.Component {
  static propTypes = {
    start: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    end: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    content: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    settings: React.PropTypes.object,
    contentStartId: React.PropTypes.string,
    contentId: React.PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      height: window.innerHeight - 60
    }
    if (env('MOBILE_DETECT')) {
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        this.isMobile = true
      }
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
    const { content, settings, contentId } = this.props
    if (content === 'treeView') {
      return <TreeViewLayout contentId={contentId} />
    } else if (content === 'addElement') {
      return <AddElementPanel options={settings || {}} />
    } else if (content === 'addHubElement') {
      return (
        <AddElementPanel options={settings || {}}>
          <TeaserAddElementCategories parent={{}} />
        </AddElementPanel>
      )
    } else if (content === 'addTemplate') {
      return <AddTemplatePanel />
    } else if (content === 'settings') {
      return <SettingsPanel />
    } else if (content === 'editElement') {
      if (settings && settings.element) {
        const activeTabId = settings.tag || ''
        const cookElement = cook.get(settings.element)
        return <EditElementPanel key={`panels-container-edit-element-${cookElement.get('id')}`} element={cookElement} activeTabId={activeTabId} />
      }
    }
  }

  getStartContent () {
    const { start, contentStartId } = this.props
    if (start === 'treeView') {
      return <TreeViewLayout contentStartId={contentStartId} />
    }
  }

  getEndContent () {
    const { end, settings } = this.props
    if (end === 'addElement') {
      return <AddElementPanel options={settings || {}} />
    } else if (end === 'addHubElement') {
      return (
        <AddElementPanel options={settings || {}}>
          <TeaserAddElementCategories parent={{}} />
        </AddElementPanel>
      )
    } else if (end === 'addTemplate') {
      return <AddTemplatePanel />
    } else if (end === 'settings') {
      return <SettingsPanel />
    } else if (end === 'editElement') {
      if (settings && settings.element) {
        const activeTabId = settings.tag || ''
        const cookElement = cook.get(settings.element)
        return <EditElementPanel key={`panels-container-edit-element-${cookElement.get('id')}`} element={cookElement} activeTabId={activeTabId} />
      }
    }
  }

  render () {
    const { start, end, content } = this.props
    let layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': !!(start || end || content),
      'vcv-layout-bar-content-mobile': this.isMobile
    })
    let layoutStyle = {}

    if (this.isMobile) {
      layoutStyle.height = this.state.height
    }

    if (env('NAVBAR_SINGLE_CONTENT')) {
      if (env('HUB_REDESIGN')) {
        return (
          <div className={layoutClasses} style={layoutStyle} ref={this.props.wrapperRef}>
            <Content content={content}>
              {this.getContent()}
            </Content>
          </div>
        )
      }
      return (
        <div className={layoutClasses} style={layoutStyle}>
          <Content content={content}>
            {this.getContent()}
          </Content>
        </div>
      )
    }

    return (
      <div className={layoutClasses} style={layoutStyle}>
        <ContentStart>
          {this.getStartContent()}
        </ContentStart>
        <ContentEnd content={end} >
          {this.getEndContent()}
        </ContentEnd>
      </div>
    )
  }
}
