/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import TreeContentTab from './tab'
import DesignOptions from './design-options/design-options'
import {getService} from 'vc-cake'

// import PerfectScrollbar from 'perfect-scrollbar'
let allTabs = []
let designOptions = {}

class TreeForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      tabsCount: 0,
      visibleTabsCount: 0,
      activeTabIndex: 0
    }
    this.handleElementResize = this.handleElementResize.bind(this)
    this.saveForm = this.saveForm.bind(this)
    this.closeTreeView = this.closeTreeView.bind(this)
  }

  componentWillMount () {
    allTabs = this.tabsFromProps(this.props)
    this.setState({
      tabsCount: allTabs.length
    })
  }

  componentDidMount () {
    this.props.api.reply('element:set', function (key, value) {
      this.props.element.set(key, value)
    }.bind(this))
    designOptions = getService('asset-manager').getDesignOptions()[ this.props.element.get('id') ]
    this.addResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs-free-space'), this.handleElementResize)
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs-free-space'), this.handleElementResize)
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    var obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
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

  handleElementResize (e) {
    this.refreshTabs()
  }

  tabsFromProps (props) {
    let tabs = []
    props.element.editFormTabs().map((tab, index) => {
      let tabsData = {
        id: tab.key,
        index: index,
        title: tab.data.settings.options.label,
        isVisible: true,
        pinned: tab.data.settings.options.pinned || false,
        params: props.element.editFormTabParams(tab.key)
      }
      tabs.push(tabsData)
    })

    tabs.push({
      id: 'editFormTabDesignOptions',
      index: tabs.length,
      title: 'Design Options',
      isVisible: true,
      pinned: false,
      type: 'design-options',
      params: []
    })

    return tabs
  }

  changeActiveTab (tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    })
  }

  changeDesignOption (newDesignOptions) {
    designOptions = newDesignOptions
  }

  getVisibleTabs () {
    return allTabs.filter((tab) => {
      if (tab.isVisible) {
        return true
      }
    })
  }

  getHiddenTabs () {
    let tabs = allTabs.filter((tab) => {
      return !tab.isVisible
    })
    tabs.reverse()
    return tabs
  }

  getVisibleAndUnpinnedTabs () {
    return this.getVisibleTabs().filter((tab) => {
      return tab.isVisible && !tab.pinned
    })
  }

  refreshTabs () {
    // get tabs line width
    let $tabsLine = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs')
    let $freeSpaceEl = $tabsLine.querySelector('.vcv-ui-editor-tabs-free-space')
    let freeSpace = $freeSpaceEl.offsetWidth

    // If there is no space move tab from visible to hidden tabs.
    let visibleAndUnpinnedTabs = this.getVisibleAndUnpinnedTabs()
    if (freeSpace === 0 && visibleAndUnpinnedTabs.length > 0) {
      let lastTab = visibleAndUnpinnedTabs.pop()
      allTabs[ lastTab.index ].isVisible = false
      this.setState({
        visibleTabsCount: this.getVisibleTabs().length
      })
      this.refreshTabs()
      return
    }

    // If we have free space move tab from hidden tabs to visible.
    let hiddenTabs = this.getHiddenTabs()
    if (hiddenTabs.length) {
      // if it is las hidden tab than add dropdown width to free space
      if (hiddenTabs.length === 1) {
        let dropdown = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tab-dropdown')
        freeSpace += dropdown.offsetWidth
      }
      while (freeSpace > 0 && hiddenTabs.length) {
        let lastTab = hiddenTabs.pop()
        let controlsSize = lastTab.ref.getRealWidth()
        freeSpace -= controlsSize
        if (freeSpace > 0) {
          allTabs[ lastTab.index ].isVisible = true
        }
      }
      this.setState({
        visibleTabsCount: this.getVisibleTabs().length
      })
      return
    }
  }

  getForm (tabIndex) {
    let tab = allTabs[ tabIndex ]
    if (tab.type && tab.type === 'design-options') {
      let props = {
        changeDesignOption: this.changeDesignOption.bind(this),
        values: designOptions
      }
      return <DesignOptions {...props} />
    }
    return tab.params.map(this.getFormParamField.bind(this))
  }

  getFormParamField (param) {
    let updater = lodash.curry((callback, event, key, value) => { callback(event, key, value) })
    return this.props.element.field(param.key, updater(this.props.api.request, 'element:set'))
  }

  closeTreeView () {
    this.props.api.notify('hide')
    this.props.api.request('bar-content-start:hide')
  }

  saveForm () {
    let element = this.props.element
    this.props.api.request('data:update', element.get('id'), element.toJS(true))
    getService('asset-manager').addDesignOption(element.get('id'), designOptions)
  }

  getTabProps (tabIndex, activeTabIndex) {
    let tab = allTabs[ tabIndex ]

    return {
      key: tab.id,
      id: tab.id,
      index: tab.index,
      title: tab.title,
      active: (activeTabIndex === tab.index),
      container: '.vcv-ui-editor-tabs',
      ref: (ref) => {
        if (allTabs[ tab.index ]) {
          allTabs[ tab.index ].ref = ref
        }
      },
      changeActive: this.changeActiveTab.bind(this)
    }
  }

  render () {
    let { activeTabIndex } = this.state
    var visibleTabsHeaderOutput = []
    lodash.each(this.getVisibleTabs(), (tab) => {
      let { ...tabProps } = this.getTabProps(tab.index, activeTabIndex)
      visibleTabsHeaderOutput.push(
        <TreeContentTab {...tabProps} />
      )
    })
    var hiddenTabsHeaderOutput = ''
    if (this.getHiddenTabs().length) {
      var hiddenTabsHeader = []
      lodash.each(this.getHiddenTabs(), (tab) => {
        let { ...tabProps } = this.getTabProps(tab.index, activeTabIndex)
        hiddenTabsHeader.push(
          <TreeContentTab {...tabProps} />
        )
      })

      let dropdownClasses = classNames({
        'vcv-ui-editor-tab-dropdown': true,
        'vcv-ui-state--active': !!this.getHiddenTabs().filter(function (tab) {
          return tab.index === activeTabIndex
        }).length
      })
      hiddenTabsHeaderOutput = (
        <dl className={dropdownClasses}>
          <dt className="vcv-ui-editor-tab-dropdown-trigger vcv-ui-editor-tab" title="More">
            <span className="vcv-ui-editor-tab-content">
              <i className="vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-more-dots"></i>
            </span>
          </dt>
          <dd className="vcv-ui-editor-tab-dropdown-content">
            {hiddenTabsHeader}
          </dd>
        </dl>
      )
    }
    var visibleTabsContentOutput = []
    lodash.each(this.getVisibleTabs(), (tab) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tab.index === activeTabIndex) {
        plateClass += ' vcv-ui-state--active'
      }
      visibleTabsContentOutput.push(<div key={'plate-visible' + allTabs[tab.index].id} className={plateClass}>
        {this.getForm(tab.index)}
      </div>)
    })

    var hiddenTabsContentOutput = []
    lodash.each(this.getHiddenTabs(), (tab) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tab.index === activeTabIndex) {
        plateClass += ' vcv-ui-state--active'
      }
      visibleTabsContentOutput.push(<div key={'plate-hidden' + allTabs[tab.index].id} className={plateClass}>
        {this.getForm(tab.index)}
      </div>)
    })

    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

      // <nav className="vcv-ui-tree-content-title-controls">
      // <a className="vcv-ui-tree-content-title-control" href="#" title="document-alt-stroke bug">
      // <span className="vcv-ui-tree-content-title-control-content">
      // <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-document-alt-stroke"></i>
      // </span>
      // </a>
      // <a className="vcv-ui-tree-content-title-control" href="#" title="heart-stroke bug" disabled="">
      // <span className="vcv-ui-tree-content-title-control-content">
      // <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-heart-stroke"></i>
      // </span>
      // </a>
      // <a className="vcv-ui-tree-content-title-control" href="#" title="settings bug">
      // <span className="vcv-ui-tree-content-title-control-content">
      // <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-cog"></i>
      // </span>
      // </a>
      // </nav>

    return <div className="vcv-ui-tree-view-content">
      <div className={treeContentClasses}>
        <div className="vcv-ui-editor-tabs-container">
          <nav className="vcv-ui-editor-tabs">
            {visibleTabsHeaderOutput}
            {hiddenTabsHeaderOutput}
            <span className="vcv-ui-editor-tabs-free-space"></span>
          </nav>
        </div>

        <div ref="scrollable" className="vcv-ui-tree-content-section">
          <div className="vcv-ui-scroll-container">
            <div className="vcv-ui-scroll">
              <div className="vcv-ui-scroll-content">
                <div className="vcv-ui-tree-content-section-inner">
                  <div className="vcv-ui-editor-plates-container">
                    <div className="vcv-ui-editor-plates">
                      {visibleTabsContentOutput}
                      {hiddenTabsContentOutput}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="vcv-ui-tree-content-footer">
          <div className="vcv-ui-tree-layout-actions">
            <a className="vcv-ui-tree-layout-action" href="#" title="Save" onClick={this.saveForm}>
              <span className="vcv-ui-tree-layout-action-content">
                <i className="vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-save"></i>
                <span>Save</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  }
}

TreeForm.propTypes = {
  api: React.PropTypes.object.isRequired,
  element: React.PropTypes.object.isRequired
}

module.exports = TreeForm
