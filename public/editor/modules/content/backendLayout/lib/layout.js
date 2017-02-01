import React from 'react'
import { getData } from 'vc-cake'
import Element from './element'
import BlankPageManagerBack from '../lib/helpers/BlankPageManagerBack/component'
import _ from 'lodash'

export default class Layout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  backendLayout = null
  isResizeActive = false

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      activeElementId: '',
      layout: {},
      layoutWidth: {}
    }
    this.handleOpenElement = this.handleOpenElement.bind(this)
    this.handleResize = _.debounce(this.handleResize.bind(this), 150)
    this.getLayout = this.getLayout.bind(this)
  }

  componentDidMount () {
    this.props.api.reply('data:changed', (data) => {
      this.setState({
        data: data
      })
    })
  }

  componentWillUnmount () {
    this.removeResizeListener(this.backendLayout, this.handleResize)
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
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

  handleResize () {
    this.setState({
      layout: this.backendLayout,
      layoutWidth: this.backendLayout.getBoundingClientRect()
    })
  }

  handleOpenElement (id) {
    this.setState({ activeElementId: id })
  }

  getLayout () {
    return this.backendLayout ? this.backendLayout : this.state.layout
  }

  getElements () {
    let { data, activeElementId, layoutWidth } = this.state
    let elementsList
    if (data) {
      elementsList = data.map((element) => {
        return (
          <Element
            element={element}
            key={'vcvLayoutGetElements' + element.id}
            api={this.props.api}
            openElement={this.handleOpenElement}
            activeElementId={activeElementId}
            layout={this.getLayout}
            layoutWidth={layoutWidth}
          />
        )
      })
    }
    if (!this.isResizeActive && this.backendLayout) {
      this.addResizeListener(this.backendLayout, this.handleResize)
      this.isResizeActive = true
    }
    return <div
      className='vcv-wpbackend-layout'
      data-vcv-module='content-layout'
      ref={(layout) => { this.backendLayout = layout }}
    >
      {elementsList}
    </div>
  }

  render () {
    return this.state.data.length && getData('app:dataLoaded') ? this.getElements() : <BlankPageManagerBack api={this.props.api} iframe={false} />
  }
}
