import React from 'react'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import Resizer from '../../resizer/resizer'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
const dataManager = getService('dataManager')
const workspaceSettings = getStorage('workspace').state('settings')

export default class Content extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]).isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      realWidth: 0
    }
    this.contentRef = React.createRef()

    this.handleElementResize = debounce(this.handleElementResize.bind(this), 50)
    this.handleClickCloseContent = this.handleClickCloseContent.bind(this)

    this.resizeObserver = new window.ResizeObserver(this.handleElementResize)
  }

  componentDidMount () {
    this.resizeObserver.observe(this.contentRef.current)
  }

  componentWillUnmount () {
    this.resizeObserver.unobserve(this.contentRef.current)
  }

  handleElementResize () {
    const element = this.contentRef && this.contentRef.current
    if (element) {
      this.setState({
        realWidth: element.offsetWidth
      })
    }
  }

  handleClickCloseContent (e) {
    e && e.preventDefault()
    workspaceSettings.set(false)
  }

  render () {
    const localizations = dataManager.get('localizations')
    let closeTitle = localizations ? localizations.close : 'Close'
    closeTitle = closeTitle + ' (Esc)'

    let aligned = false
    const { children, content } = this.props

    if (content && (content === 'addElement' || content === 'addTemplate' || content === 'addHubElement')) {
      aligned = true
    }

    const currentSettings = workspaceSettings.get()

    const contentClasses = classNames({
      'vcv-layout-bar-content-all': true,
      'vcv-ui-state--visible': !!children,
      'vcv-media--xs': true,
      'vcv-media--sm': this.state.realWidth > 400,
      'vcv-media--md': this.state.realWidth > 800,
      'vcv-media--lg': this.state.realWidth > 1200,
      'vcv-media--xl': this.state.realWidth > 1600,
      'vcv-ui-hide-resizers': currentSettings && currentSettings.action && (currentSettings.action === 'addHub')
    })

    const closeBtnClasses = classNames({
      'vcv-layout-bar-content-hide': true,
      'vcv-layout-bar-content-aligned': aligned
    })

    let closeButton = null
    if (content === 'addHubElement' || content === 'messages' || content === 'settings' || content === 'atarim') {
      closeButton = (
        <span className={closeBtnClasses} title={closeTitle} onClick={this.handleClickCloseContent}>
          <i className='vcv-layout-bar-content-hide-icon vcv-ui-icon vcv-ui-icon-close-thin' />
        </span>
      )
    }

    return (
      <div className={contentClasses} id='vcv-editor-end' ref={this.contentRef}>
        {closeButton}
        {children}
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-top vcv-ui-resizer-content-all-bottom'
        }}
        />

        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-left vcv-ui-resizer-content-all-right'
        }}
        />

        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-right vcv-ui-resizer-content-all-left'
        }}
        />

        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-bottom vcv-ui-resizer-content-all-top'
        }}
        />
      </div>
    )
  }
}
