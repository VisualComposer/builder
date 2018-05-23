import React from 'react'
import classNames from 'classnames'
import Content from 'public/resources/components/contentParts/content'
import AddElementPanel from 'public/resources/components/addElement/addElementPanel'
import TeaserAddElementCategories from 'public/resources/components/teaserAddElement/lib/teaserCategories'
import AddTemplatePanel from 'public/resources/components/addTemplate/addTemplatePanel'
import TreeViewLayout from 'public/resources/components/treeView/treeViewLayout'
import SettingsPanel from 'public/resources/components/settings/settingsPanel'
import EditElementPanel from 'public/resources/components/editElement/editElementPanel'
import EditFormPanel from 'public/resources/components/editForm/editFormPanel'
import { getService, env } from 'vc-cake'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

const cook = getService('cook')

export default class PanelsContainer extends React.Component {
  static propTypes = {
    start: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    end: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    content: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    settings: PropTypes.object,
    contentStartId: PropTypes.string,
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
    const { content, settings, contentId } = this.props
    if (content === 'treeView') {
      if (!env('FT_COLLAPSE_ELEMENTS_TREE_VIEW')) {
        return <TreeViewLayout contentId={contentId} />
      } else {
        return null
      }
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
        if (env('REFACTOR_ELEMENT_ACCESS_POINT')) {
          return <EditFormPanel key={`panels-container-edit-element-${settings.element.id}`} element={settings.element} activeTabId={activeTabId} options={settings.options || {}} />
        } else {
          const cookElement = cook.get(settings.element)
          return <EditElementPanel key={`panels-container-edit-element-${cookElement.get('id')}`} element={cookElement} activeTabId={activeTabId} options={settings.options || {}} />
        }
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
    const { start, end, content, contentId } = this.props
    let layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': !!(start || end || content),
      'vcv-layout-bar-content-mobile': this.isMobile
    })
    let layoutStyle = {}

    if (this.isMobile) {
      layoutStyle.height = this.state.height
    }
    let treeViewLayout = ''
    if (env('FT_COLLAPSE_ELEMENTS_TREE_VIEW')) {
      treeViewLayout = <TreeViewLayout contentId={contentId} visible={content === 'treeView'} />
    }

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
