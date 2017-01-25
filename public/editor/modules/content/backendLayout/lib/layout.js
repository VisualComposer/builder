import React from 'react'
import ReactDOM from 'react-dom'
import { getData } from 'vc-cake'
import Element from './element'
import BlankPageManagerBack from '../lib/helpers/BlankPageManagerBack/component'
import _ from 'lodash'

export default class Layout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

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
  }

  componentDidMount () {
    this.props.api.reply('data:changed', (data) => {
      this.setState({
        data: data
      })
      if (ReactDOM.findDOMNode(this).classList.contains('vcv-wpbackend-layout')) {
        this.setState({
          layout: ReactDOM.findDOMNode(this)
        })
        this.addResizeListener(ReactDOM.findDOMNode(this), this.handleResize)
      }
    })
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this), this.handleResize)
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
    this.setState({ layoutWidth: ReactDOM.findDOMNode(this).getBoundingClientRect() })
  }

  handleOpenElement (id) {
    this.setState({ activeElementId: id })
  }

  getElements () {
    let { data, activeElementId, layout, layoutWidth } = this.state
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
            layout={layout}
            layoutWidth={layoutWidth}
          />
        )
      })
    }
    return <div className='vcv-wpbackend-layout' data-vcv-module='content-layout'>
      {elementsList}
    </div>
  }

  render () {
    return this.state.data.length && getData('app:dataLoaded') ? this.getElements() : <BlankPageManagerBack api={this.props.api} iframe={false} />
  }
}
