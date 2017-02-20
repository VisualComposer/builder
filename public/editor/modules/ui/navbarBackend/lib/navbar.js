import React from 'react'
import ReactDOM from 'react-dom'
import NavbarControl from './control'
import '../../../../../sources/less/ui/navbar/init.less'

let navbarControls = []

export default class Navbar extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      controlsCount: 0,
      visibleControlsCount: 0
    }

    this.refreshControls = this.refreshControls.bind(this)
  }

  componentWillMount () {
    this.props.api.addAction('addElement', (name, Icon, options = {}) => {
      if (!options.hasOwnProperty('pin') || typeof options.pin !== 'string') {
        options.pin = false
      }

      // set Settings pin to visible
      if (name === 'Settings') {
        options.pin = 'visible'
      }

      // set default visibility
      let isControlVisible
      switch (options.pin) {
        case 'visible':
          isControlVisible = true
          break
        case 'hidden':
          isControlVisible = false
          break
        default:
          isControlVisible = true
      }

      navbarControls.push({
        index: navbarControls.length,
        name: name,
        icon: Icon,
        pin: options.pin,
        options: options,
        isVisible: isControlVisible
      })
      this.props.api.notify('build', navbarControls.length)
    })
  }

  componentDidMount () {
    this.props.api
      .on('build', (count) => {
        this.setState({ controlsCount: count })
        this.refreshControls()
      })
    this.addResizeListener(ReactDOM.findDOMNode(this), this.refreshControls)
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this), this.refreshControls)
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

  getVisibleControls () {
    return navbarControls.filter((control) => {
      if (control.isVisible) {
        return true
      }
    })
  }

  getHiddenControls () {
    return navbarControls.filter((control) => {
      return !control.isVisible
    })
  }

  buildVisibleControls () {
    let controls = this.getVisibleControls()
    if (!controls.length) {
      return
    }
    return controls.map((value) => {
      return (<NavbarControl
        api={value.options.api ? value.options.api : this.props.api}
        key={'Navbar:' + value.name}
        value={value}
        container='.vcv-ui-navbar'
        ref={(ref) => {
          navbarControls[ value.index ].ref = ref
        }}
      />)
    })
  }

  buildHiddenControls () {
    let controls = this.getHiddenControls()
    if (!controls.length) {
      return
    }
    return controls.map((value) => {
      return React.createElement(NavbarControl, {
        api: this.props.api,
        key: 'Navbar:' + value.name,
        value: value,
        container: '.vcv-ui-navbar',
        ref: (ref) => {
          navbarControls[ value.index ].ref = ref
        }
      })
    })
  }

  refreshControls () {
    // get free space
    let freeSpaceEl = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-navbar-controls-spacer')
    let freeSpace = freeSpaceEl.offsetWidth

    // hide control if there is no space
    let visibleAndUnpinnedControls = this.getVisibleControls().filter((control) => {
      return control.isVisible && control.pin !== 'visible'
    })
    if (visibleAndUnpinnedControls.length && freeSpace === 0) {
      let lastControl = visibleAndUnpinnedControls.pop()
      navbarControls[ lastControl.index ].isVisible = false
      this.setState({
        visibleControlsCount: this.getVisibleControls().length
      })
      return
    }

    // show controls if there is available space
    let hiddenAndUnpinnedControls = this.getHiddenControls().filter((control) => {
      return !control.isVisible && control.pin !== 'hidden'
    })
    if (hiddenAndUnpinnedControls.length && freeSpace > 0) {
      while (freeSpace > 0 && hiddenAndUnpinnedControls.length) {
        let lastControl = hiddenAndUnpinnedControls.pop()
        let controlsSize = lastControl.ref.state.realSize.width
        freeSpace -= controlsSize
        if (freeSpace > 0) {
          navbarControls[ lastControl.index ].isVisible = true
        }
      }

      this.setState({
        visibleControlsCount: this.getVisibleControls().length
      })
    }
  }

  render () {
    return (
      <div id='vc-navbar-container'>
        <div className='vcv-ui-navbar-container'>
          <nav className='vcv-ui-navbar vcv-ui-navbar-hide-labels'>
            {this.buildVisibleControls()}
            <div className='vcv-ui-navbar-hidden-controls'>
              {this.buildHiddenControls()}
            </div>
            <div className='vcv-ui-navbar-drag-handler vcv-ui-navbar-controls-spacer' />
          </nav>
        </div>
      </div>
    )
  }
}
