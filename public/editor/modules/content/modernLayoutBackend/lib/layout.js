import React from 'react'
import { getStorage } from 'vc-cake'
import Element from './element'
import BlankRowPlaceholder from '../../../../../resources/components/layoutHelpers/blankRowPlaceholder/component'

const elementsStorage = getStorage('elements')
const wordpressBackendDataStorage = getStorage('wordpressData')
const backendAssetsStorage = getStorage('assetsBackend')
const workspaceStorage = getStorage('workspace')

export default class Layout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      isDataLoaded: false,
      layoutWidth: 0,
      hasResizeEvent: false,
      isElementsExist: false
    }
    this.layoutContainer = null
    this.layoutContainerRect = null
    this.handleElementSize = this.handleElementSize.bind(this)
  }

  componentDidMount () {
    elementsStorage.state('document').onChange((data) => {
      this.setState({ data: data })
      if (this.layoutContainer && !this.state.hasResizeEvent) {
        this.addResizeListener(this.layoutContainer, this.handleElementSize)
        this.setState({ hasResizeEvent: true })
      }
    }, {
      debounce: 50
    })
    wordpressBackendDataStorage.state('status').onChange((data) => {
      if (data.status === 'loaded') {
        this.setState({ isDataLoaded: true })
      }
    })
    workspaceStorage.state('settings').onChange((data) => {
      if (data && !this.state.isElementsExist) {
        this.setState({ isElementsExist: !this.state.isElementsExist })
      }
    })
  }

  componentWillUnmount () {
    this.removeResizeListener(this.layoutContainer, this.handleElementSize)
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('iframe')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
      this.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }

  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }

  handleElementSize () {
    this.setState({ layoutWidth: this.layoutContainer.getBoundingClientRect().width })
  }

  getElements () {
    const { data, layoutWidth, isElementsExist } = this.state
    const backendAssetsState = backendAssetsStorage.state('jobs').get()
    let loader = this.getLoader()
    let layoutStyles = {
      visibility: 'hidden',
      opacity: 0
    }
    let wrapperStyles = {
      height: '216px'
    }
    let elementsList
    if (data) {
      elementsList = data.map((element) => {
        return (
          <Element
            element={element}
            key={'vcvLayoutGetElements' + element.id}
            api={this.props.api}
            layoutWidth={layoutWidth}
          />
        )
      })
    }

    if ((backendAssetsState && !backendAssetsState.jobs) || (data.length && isElementsExist)) {
      layoutStyles = {}
      wrapperStyles = {}
      loader = null
    }

    return <div className='vcv-wpbackend-layout-wrapper' style={wrapperStyles}>
      {loader}
      <div
        className='vcv-wpbackend-layout'
        data-vcv-module='content-layout'
        style={layoutStyles}
        ref={(container) => { this.layoutContainer = container }}>
        {elementsList}
        <BlankRowPlaceholder api={this.props.api} />
      </div>
    </div>
  }

  getLoader () {
    return <div className='vcv-loading-overlay'>
      <div className='vcv-loading-overlay-inner'>
        <div className='vcv-loading-dots-container'>
          <div className='vcv-loading-dot vcv-loading-dot-1' />
          <div className='vcv-loading-dot vcv-loading-dot-2' />
        </div>
      </div>
    </div>
  }

  render () {
    const { data, isElementsExist } = this.state

    if (!data.length && isElementsExist) {
      return <BlankRowPlaceholder api={this.props.api} />
    }
    return this.getElements()
  }
}
