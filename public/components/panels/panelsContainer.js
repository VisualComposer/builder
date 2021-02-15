import React from 'react'
import classNames from 'classnames'
import Content from './contentParts/content'
import EditFormPanel from './editForm/lib/editFormPanel'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import innerAPI from 'public/components/api/innerAPI'

export default class PanelsContainer extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
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

    innerAPI.mount('panel:editElement', () => <EditFormPanel key='panels-container-editElement' />)
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
    PanelsContainer.openedPanels[this.props.content] = true
    const response = []
    if (PanelsContainer.openedPanels.treeView) {
      response.push(innerAPI.pick('panel:treeView', null))
    }
    if (PanelsContainer.openedPanels.addElement) {
      response.push(innerAPI.pick('panel:addElement', null))
    }
    if (PanelsContainer.openedPanels.addTemplate) {
      response.push(innerAPI.pick('panel:addTemplate', null))
    }
    if (PanelsContainer.openedPanels.addHubElement) {
      response.push(innerAPI.pick('panel:addHubElement', null))
    }
    if (PanelsContainer.openedPanels.insights) {
      response.push(innerAPI.pick('panel:insights', null))
    }
    if (PanelsContainer.openedPanels.settings) {
      response.push(innerAPI.pick('panel:settings', null))
    }
    if (PanelsContainer.openedPanels.editElement) {
      response.push(innerAPI.pick('panel:editElement', null))
    }

    return response
  }

  render () {
    const { content } = this.props
    const layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': !!content,
      'vcv-layout-bar-content-mobile': this.isMobile,
      'vcv-content-full-size': content === 'addHubElement'
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
