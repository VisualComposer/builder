import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import CategoryTab from './category-tab'
import ElementControl from './element-control'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
import '../css/init.less'

let allTabs = []

class Categories extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      tabsHash: '',
      visibleTabsCount: 0,
      activeTabIndex: 0
    }
    this.tabsFromProps = this.tabsFromProps.bind(this)
  }

  componentWillMount () {
    this.tabsFromProps(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.tabsFromProps(nextProps)
  }

  componentDidMount () {
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

  handleElementResize = () => {
    this.refreshTabs()
  }

  getTabsHash (tabs) {
    let hash = ''
    for (let tab of tabs) {
      hash += tab.id
    }
    return hash
  }
  getCategoriesElements (data, category) {
    const sortMethod = (a, b) => {
      if (a.order && b.order === undefined) {
        return -1
      } else if (a.order === undefined && b.order) {
        return 1
      } else if (a.order && b.order) {
        return a.order - b.order
      }
      return a.name.localeCompare(b.name, {kn: true}, {sensitivity: 'base'})
    }
    return lodash(data).filter((element) => {
      return Array.isArray(element.elementGroup) && element.elementGroup.indexOf(category) > -1 ||
        element.elementGroup === category
    }).sort(sortMethod).value()
  }
  getCategoriesFromElements (elements) {
    const sortMethod = (a, b) => {
      if (a === 'All') {
        return -1
      } else if (b === 'All') {
        return 1
      }
      return a.localeCompare(b, {kn: true}, {sensitivity: 'base'})
    }
    return lodash(elements)
      .map('elementGroup')
      .flatten()
      .compact()
      .uniq()
      .sort(sortMethod)
      .value()
  }
  tabsFromProps (props) {
    let categories = this.getCategoriesFromElements(props.elements)
    allTabs = categories.map((title, index) => {
      return {
        id: title + index, // TODO: Should it be more unique?
        index: index,
        title: title,
        elements: this.getCategoriesElements(props.elements, title),
        isVisible: true,
        pinned: false // TODO: Actual logic.
      }
    })
    this.setState({
      tabsHash: this.getTabsHash(allTabs)
    })
  }

  changeActiveTab = (tabIndex) => {
    this.setState({
      activeTabIndex: tabIndex
    })
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
    }
  }

  getRenderedElements (tabIndex) {
    let itemsOutput = []
    allTabs[ tabIndex ].elements.map((element) => {
      itemsOutput.push(<ElementControl
        api={this.props.api}
        key={'vcv-element-control-' + element.tag}
        element={element}
        tag={element.tag}
        name={element.name} />)
    })

    return <div className='vcv-ui-add-element-list-container'>
      <ul className='vcv-ui-add-element-list'>
        {itemsOutput}
      </ul>
    </div>
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
      changeActive: this.changeActiveTab
    }
  }

  render () {
    let { activeTabIndex } = this.state
    var visibleTabsHeaderOutput = []
    lodash.each(this.getVisibleTabs(), (tab) => {
      let { ...tabProps } = this.getTabProps(tab.index, activeTabIndex)
      visibleTabsHeaderOutput.push(
        <CategoryTab {...tabProps} />
      )
    })
    var hiddenTabsHeaderOutput = ''
    if (this.getHiddenTabs().length) {
      var hiddenTabsHeader = []
      lodash.each(this.getHiddenTabs(), (tab) => {
        let { ...tabProps } = this.getTabProps(tab.index, activeTabIndex)
        hiddenTabsHeader.push(
          <CategoryTab {...tabProps} />
        )
      })

      let dropdownClasses = classNames({
        'vcv-ui-editor-tab-dropdown': true,
        'vcv-ui-editor-tab-collapse': true,
        'vcv-ui-state--active': !!this.getHiddenTabs().filter(function (tab) {
          return tab.index === activeTabIndex
        }).length
      })
      hiddenTabsHeaderOutput = (
        <dl className={dropdownClasses}>
          <dt className='vcv-ui-editor-tab-dropdown-trigger vcv-ui-editor-tab' title='More'>
            <span className='vcv-ui-editor-tab-content'>
              <i className='vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-more-dots' />
            </span>
          </dt>
          <dd className='vcv-ui-editor-tab-dropdown-content'>
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
      visibleTabsContentOutput.push(<div key={'plate-visible' + allTabs[ tab.index ].id} className={plateClass}>
        {this.getRenderedElements(tab.index)}
      </div>)
    })

    var hiddenTabsContentOutput = []
    lodash.each(this.getHiddenTabs(), (tab) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tab.index === activeTabIndex) {
        plateClass += ' vcv-ui-state--active'
      }
      visibleTabsContentOutput.push(<div key={'plate-hidden' + allTabs[ tab.index ].id} className={plateClass}>
        {this.getRenderedElements(tab.index)}
      </div>)
    })

    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    return <div className={treeContentClasses}>
      <div className='vcv-ui-editor-tabs-container'>
        <nav className='vcv-ui-editor-tabs'>
          {visibleTabsHeaderOutput}
          {hiddenTabsHeaderOutput}
          <span className='vcv-ui-editor-tabs-free-space' />
        </nav>
      </div>

      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                {visibleTabsContentOutput}
                {hiddenTabsContentOutput}
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  }
}
Categories.propTypes = {
  api: React.PropTypes.object.isRequired,
  elements: React.PropTypes.array.isRequired
}

export default Categories
