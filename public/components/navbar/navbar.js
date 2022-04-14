import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'
import lodash from 'lodash'
import { getRealSize } from './tools'
import { Scrollbars } from 'react-custom-scrollbars'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import WordpressPostSaveControl from './controls/wordpressPostSaveControl'
import NavbarSeparator from './controls/navbarSeparator'

const wordpressBackendDataStorage = vcCake.getStorage('wordpressData')
const workspaceSettings = vcCake.getStorage('workspace').state('settings')
const dataManager = vcCake.getService('dataManager')

export default class Navbar extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }

  constructor (props) {
    super(props)
    this.navbarPosition = 'left'
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile()) {
      this.isMobile = true
      this.navbarPosition = 'top'
    }
    this.state = {
      visibleControls: this.setVisibleControls(),
      controlsCount: 0,
      saving: false,
      saved: false,
      isActiveSandwich: false
    }

    if (this.isMobile && vcCake.env('editor') === 'frontend') {
      let isScrolling = 0

      window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling)
        isScrolling = setTimeout(() => {
          window.scrollTo(0, 0)
        }, 66)
      }, false)
    }

    this.spacerRef = React.createRef()
    this.navbarContainer = React.createRef()

    this.hiddenControlsIndex = []
    this.handleDropdown = this.handleDropdown.bind(this)
    this.handleElementResize = this.handleElementResize.bind(this)
    this.refreshControls = this.refreshControls.bind(this)
    this.setHiddenControlsReference = this.setHiddenControlsReference.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)

    this.resizeObserver = new window.ResizeObserver(this.handleElementResize)
  }

  setVisibleControls () {
    const children = React.Children.toArray(this.props.children)
    return children.filter((node) => {
      return !node.props.visibility || node.props.visibility !== 'hidden'
    }).map((node) => {
      return node.key
    })
  }

  componentDidMount () {
    const spacerElement = this.spacerRef && this.spacerRef.current
    if (spacerElement) {
      this.resizeObserver.observe(spacerElement)
      wordpressBackendDataStorage.state('activeEditor').onChange(this.handleVisibilityChange)
      this.handleElementResize()
    }
  }

  updateWrapper () {
    // TODO: move this method to wrapper itself
    const navBarStyle = {}
    const manageLock = (shouldLocked) => {
      if (shouldLocked) {
        document.body.classList.remove('vcv-layout-dock--unlock')
        document.body.classList.add('vcv-layout-dock--lock')
      } else {
        document.body.classList.remove('vcv-layout-dock--lock')
        document.body.classList.add('vcv-layout-dock--unlock')
      }
    }

    for (let i = 0; i < document.body.classList.length; i++) {
      if (document.body.classList.item(i).search('vcv-layout-dock--') === 0) {
        document.body.classList.remove(document.body.classList.item(i))
      }
    }

    document.body.classList.add('vcv-layout-dock')
    document.body.classList.add('vcv-layout-dock--' + this.navbarPosition)
    if (!document.body.querySelector('.vcv-layout-bar')) {
      return
    }
    switch (this.navbarPosition) {
      case 'top':
        manageLock(false)
        break
      case 'left': {
        const currentSettings = workspaceSettings.get()
        if (currentSettings && currentSettings.action && currentSettings.action === 'addHub') {
          manageLock(false)
        } else {
          manageLock(true)
        }
        break
      }
    }
    const targetStyle = document.body.querySelector('.vcv-layout-bar').style
    for (const prop in navBarStyle) {
      targetStyle[prop] = navBarStyle[prop]
    }
  }

  handleElementResize () {
    this.refreshControls(this.state.visibleControls)
  }

  handleVisibilityChange () {
    this.refreshControls(this.state.visibleControls, true)
  }

  componentWillUnmount () {
    this.resizeObserver.unobserve(this.spacerRef.current)
    wordpressBackendDataStorage.state('activeEditor').ignoreChange(this.handleVisibilityChange)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.visibleControls.length !== this.state.visibleControls.length) {
      setTimeout(() => {
        this.refreshControls(this.state.visibleControls)
      }, 1)
    }
  }

  getVisibleControls (visibleControls) {
    const children = React.Children.toArray(this.props.children)
    return children.filter((node) => {
      return visibleControls.includes(node.key) && node.props.visibility !== 'save'
    })
  }

  getHiddenControls (visibleControls) {
    const children = React.Children.toArray(this.props.children)
    this.hiddenControlsIndex = []
    const controls = children.filter((node) => {
      if (!visibleControls.includes(node.key) && node.props.visibility !== 'save') {
        this.hiddenControlsIndex.push(node.key)
        return true
      }
    })
    this.hiddenControlsIndex.reverse()
    controls.reverse()
    return controls
  }

  handleDropdown (e) {
    this.setState({
      isActiveSandwich: e.type === 'mouseenter'
    })
  }

  setHiddenControlsReference (ref) {
    this.hiddenControlsWrapper = ref
  }

  buildHiddenControls () {
    const localizations = dataManager.get('localizations')
    const menuTitle = localizations ? localizations.menu : 'Menu'

    const controls = this.getHiddenControls(this.state.visibleControls)
    if (!controls.length) {
      return
    }

    const singleControls = controls.filter(control => !control.props.isDropdown).map((control) => {
      return React.cloneElement(control, { handleOnClick: this.handleDropdown })
    })
    let dropdownControls = controls.filter(control => control.props.isDropdown)
    dropdownControls = dropdownControls.map(control => {
      return React.cloneElement(control, { insideDropdown: true, handleOnClick: this.handleDropdown })
    })

    const sandwichClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-sandwich': true
    })

    const navbarContentClasses = classNames({
      'vcv-ui-navbar-dropdown-content': true,
      'vcv-ui-navbar-show-labels': true,
      'vcv-ui-show-dropdown-content': this.state.isActiveSandwich
    })

    const hideTracksWhenNotNeeded = true
    return (
      <dl className={sandwichClasses} onMouseLeave={this.handleDropdown}>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control' onMouseEnter={this.handleDropdown} title={menuTitle}>
          <span className='vcv-ui-navbar-control-content'>
            <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-mobile-menu' />
            <span>{menuTitle}</span>
          </span>
        </dt>
        <dd className={navbarContentClasses}>
          <Scrollbars
            ref='scrollbars'
            renderTrackHorizontal={props => <div {...props} className='vcv-ui-scroll-track--horizontal' />}
            renderTrackVertical={props => <div {...props} className='vcv-ui-scroll-track--vertical' />}
            renderThumbHorizontal={props => <div {...props} className='vcv-ui-scroll-thumb--horizontal' />}
            renderThumbVertical={props => <div {...props} className='vcv-ui-scroll-thumb--vertical' />}
            renderView={props => <div {...props} className='vcv-ui-scroll-content' />}
            hideTracksWhenNotNeeded={hideTracksWhenNotNeeded}
            autoHeight
            autoHeightMax='100vh'
          >
            <div ref={this.setHiddenControlsReference}>
              {dropdownControls}
              {singleControls}
            </div>
          </Scrollbars>
        </dd>
      </dl>
    )
  }

  getSaveControls () {
    const children = React.Children.toArray(this.props.children)
    this.saveControlsIndex = []
    const controls = children.filter((node) => {
      if (node.props.visibility === 'save') {
        this.saveControlsIndex.push(node.key)
        return true
      }
    })
    this.saveControlsIndex.reverse()
    controls.reverse()
    return controls
  }

  /**
   * Set inline styles to content in hidden metabox for further calculations
   * @param metabox element
   */
  setMetaboxInlineStyles (metabox) {
    const inside = metabox.querySelector('.inside')
    metabox.style.overflow = 'hidden'
    inside.style.position = 'absolute'
    inside.style.top = '0'
    inside.style.display = 'block'
    inside.style.visibility = 'hidden'
    inside.style.width = '100%'
  }

  /**
   * Remove inline styles from hidden metabox
   * @param metabox element
   */
  removeMetaboxInlineStyles (metabox) {
    const inside = metabox.querySelector('.inside')
    metabox.removeAttribute('style')
    inside.removeAttribute('style')
  }

  refreshControls (visibleControls, refreshMetaBox = false) {
    const isSideNavbar = () => {
      const sidePlacements = ['left', 'right']
      return sidePlacements.indexOf(this.navbarPosition) !== -1
    }

    const metabox = document.getElementById('vcwb_visual_composer')
    // Condition for collapsed initial metabox
    if (refreshMetaBox || (metabox && this.navbarContainer.current.getBoundingClientRect().width === 0)) {
      this.setMetaboxInlineStyles(metabox)
    }

    // get free space
    const freeSpaceEl = this.spacerRef.current
    let freeSpace = isSideNavbar() ? freeSpaceEl.offsetHeight : freeSpaceEl.offsetWidth
    // hide control if there is no space
    const visibleAndUnpinnedControls = this.getVisibleControls(visibleControls).filter((control) => {
      return !control.props.visibility || control.props.visibility !== 'pinned'
    }).map((control) => {
      return control.key
    })
    if (visibleAndUnpinnedControls.length && freeSpace === 0) {
      const keyToRemove = visibleAndUnpinnedControls.pop()
      const newVisibleControls = visibleControls.filter(item => item !== keyToRemove)
      this.setState({
        visibleControls: newVisibleControls
      })
      if (metabox) {
        this.removeMetaboxInlineStyles(metabox)
      }
      return
    }
    // show controls if there is available space
    const hiddenAndUnpinnedControls = this.getHiddenControls(visibleControls).filter((control) => {
      return !control.props.visibility || control.props.visibility !== 'hidden'
    })
    if (hiddenAndUnpinnedControls.length) {
      // if it is last hidden element then add dropdown width to free space
      if (this.getHiddenControls(visibleControls).length === 1) {
        const sandwich = this.navbarContainer.current.querySelector('.vcv-ui-navbar-sandwich')
        freeSpace += isSideNavbar() ? sandwich.offsetHeight : sandwich.offsetWidth
      }
      while (freeSpace > 0 && hiddenAndUnpinnedControls.length) {
        const lastControl = hiddenAndUnpinnedControls.pop()
        const lastControlIndex = this.hiddenControlsIndex.indexOf(lastControl.key)
        const isControlSet = !this.hiddenControlsWrapper.childNodes[lastControlIndex].classList.contains('vcv-ui-navbar-control')
        const controlDOM = isControlSet ? this.hiddenControlsWrapper.childNodes[lastControlIndex].querySelector('.vcv-ui-navbar-control') : this.hiddenControlsWrapper.childNodes[lastControlIndex]
        if (!controlDOM || controlDOM.nodeType !== controlDOM.ELEMENT_NODE) {
          break
        }
        const size = getRealSize(controlDOM, '.vcv-ui-navbar')
        const controlSize = isSideNavbar() ? size.height : size.width
        freeSpace -= controlSize
        if (freeSpace > 0) {
          visibleControls.push(lastControl.key)
        }
      }
      this.setState({
        visibleControls: visibleControls
      })
    }
    if (metabox) {
      this.removeMetaboxInlineStyles(metabox)
    }
  }

  render () {
    const saveSubMenus = this.getSaveControls()
    const navbarContainerClasses = classNames({
      'vcv-ui-navbar-container': true
    })

    this.updateWrapper()
    this.props.getNavbarPosition(this.navbarPosition)

    return (
      <div className={navbarContainerClasses} ref={this.navbarContainer}>
        <nav className='vcv-ui-navbar vcv-ui-navbar-hide-labels'>
          {this.getVisibleControls(this.state.visibleControls)}
          {this.buildHiddenControls(this.state.visibleControls)}
          <NavbarSeparator />
          <WordpressPostSaveControl>
            {saveSubMenus}
          </WordpressPostSaveControl>
          <div
            className='vcv-ui-navbar-drag-handler vcv-ui-navbar-controls-spacer'
            ref={this.spacerRef}
          />
        </nav>
      </div>
    )
  }
}
