/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import CategoryTab from './category-tab'
import ElementControl from './element-control'
import '../css/init.less'

class Categories extends React.Component {

  constructor () {
    super()
    this.state = {
      allTabs: [],
      activeTabIndex: 0,
      visibleTabsIndexes: [],
      hiddenTabsIndexes: []
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.refreshTabs.bind(this))
    this.props.api.module('ui-navbar').on('resize', this.refreshTabs.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.refreshTabs)
  }

  componentDidUpdate (prevProps, prevState) {
    // TODO: Check performance.
    this.refreshTabs()
  }

  componentWillReceiveProps (nextProps) {
    let allTabs = this.tabsFromProps(nextProps)

    this.setState({
      allTabs: allTabs.slice(),
      visibleTabsIndexes: [],
      hiddenTabsIndexes: lodash.map(lodash.keys(allTabs), (i) => { return parseInt(i) }),
      activeTabIndex: 0
    })
  }

  tabsFromProps (props) {
    let tabs = []
    let index = 0

    let categories = lodash.groupBy(props.elements, (element) => {
      return element.category || 'Content'
    })
    for (let title in categories) {
      let tab = {
        id: title, // TODO: Should it be more unique?
        index: index++,
        title: title,
        elements: categories[ title ],
        pinned: false // TODO: Actual logic.

      }
      tabs.push(tab)
    }

    return tabs
  }

  changeActiveTab (tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    })
  }

  putTabToDrop (tabsCount) {
    if (!tabsCount) {
      tabsCount = 1
    }
    this.setState(function (prevState) {
      for (let i = 0; i < prevState.visibleTabsIndexes.length - 1; i++) {
        let tabIndex = prevState.visibleTabsIndexes[ i ]
        let tab = prevState.allTabs[ tabIndex ]
        if (tab.pinned) {
          continue
        }
        prevState.visibleTabsIndexes.splice(i, 1)
        prevState.hiddenTabsIndexes.unshift(tabIndex)
        if (i > tabsCount - 1) {
          break
        }
      }

      return prevState
    })
  }

  popTabFromDrop (tabsCount) {
    if (!tabsCount) {
      tabsCount = 1
    }
    this.setState(function (prevState) {
      let i = 0
      while (i < tabsCount) {
        let tabIndex = prevState.hiddenTabsIndexes.pop()
        let position = prevState.visibleTabsIndexes.length - 1
        prevState.visibleTabsIndexes.splice(position, 0, tabIndex)
        i++
      }
      return prevState
    })
  }

  getVisibleAndUnpinnedTabs () {
    return this.state.visibleTabsIndexes.filter((tabIndex) => {
      let tab = this.state.allTabs[ tabIndex ]
      return !tab.pinned
    })
  }

  refreshTabs () {
    let $tabsLine = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs')
    let $freeSpaceEl = $tabsLine.querySelector('.vcv-ui-editor-tabs-free-space')
    let freeSpace = $freeSpaceEl.offsetWidth
    let visibleAndUnpinnedTabs = this.getVisibleAndUnpinnedTabs()

    // If there is no space move tab from visible to hidden tabs.
    if (freeSpace === 0 && visibleAndUnpinnedTabs.length > 0) {
      this.putTabToDrop()
      return
    }

    // If we have free space move tab from hidden tabs to visible.
    if (this.state.hiddenTabsIndexes.length > 0) {
      let tabsCount = 0
      while (freeSpace > 0 && tabsCount < this.state.hiddenTabsIndexes.length) {
        let lastTabIndex = this.state.hiddenTabsIndexes[ tabsCount ]
        let lastTab = this.state.allTabs[ lastTabIndex ]
        if (lastTab.ref.getRealWidth() + 5 < freeSpace) {
          freeSpace -= lastTab.ref.getRealWidth()
          tabsCount++
        } else {
          freeSpace = 0
        }
      }
      if (tabsCount) {
        this.popTabFromDrop(tabsCount)
      }
    }
  }

  getRenderedElements (tabIndex) {
    let itemsOutput = []
    this.state.allTabs[ tabIndex ].elements.map((element) => {
      itemsOutput.push(<ElementControl
        api={this.props.api}
        key={'vcv-element-control-' + element.tag}
        tag={element.tag}
        name={element.name}
        icon={element.icon ? element.icon.toString() : ''} />)
    })

    return <div className="vcv-ui-add-element-list-container">
      <ul className="vcv-ui-add-element-list">
        {itemsOutput}
      </ul>
    </div>
  }

  getTabProps (tabIndex, activeTabIndex) {
    let tab = this.state.allTabs[ tabIndex ]

    return {
      key: tab.id,
      id: tab.id,
      index: tab.index,
      title: tab.title,
      active: (activeTabIndex === tab.index),
      container: '.vcv-ui-editor-tabs',
      ref: (ref) => {
        if (this.state.allTabs[ tab.index ]) {
          this.state.allTabs[ tab.index ].ref = ref
        }
      },
      changeActive: this.changeActiveTab.bind(this)
    }
  }

  render () {
    let { activeTabIndex, visibleTabsIndexes, hiddenTabsIndexes } = this.state
    var visibleTabsHeaderOutput = []
    lodash.each(visibleTabsIndexes, (tabIndex) => {
      let { ...tabProps } = this.getTabProps(tabIndex, activeTabIndex)
      visibleTabsHeaderOutput.push(
        <CategoryTab {...tabProps} />
      )
    })
    var hiddenTabsHeaderOutput = ''
    if (hiddenTabsIndexes.length) {
      var hiddenTabsHeader = []
      lodash.each(hiddenTabsIndexes, (tabIndex) => {
        let { ...tabProps } = this.getTabProps(tabIndex, activeTabIndex)
        hiddenTabsHeader.push(
          <CategoryTab {...tabProps} />
        )
      })

      let dropdownClasses = classNames({
        'vcv-ui-editor-tab-dropdown': true,
        'vcv-ui-active': !!hiddenTabsIndexes.filter(function (value) {
          return value === activeTabIndex
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
    lodash.each(visibleTabsIndexes, (tabIndex) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tabIndex === activeTabIndex) {
        plateClass += ' vcv-ui-active'
      }
      visibleTabsContentOutput.push(<div key={'plate-visible' + this.state.allTabs[tabIndex].id} className={plateClass}>
        {this.getRenderedElements(tabIndex)}
      </div>)
    })

    var hiddenTabsContentOutput = []
    lodash.each(hiddenTabsIndexes, (tabIndex) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tabIndex === activeTabIndex) {
        plateClass += ' vcv-ui-active'
      }
      visibleTabsContentOutput.push(<div key={'plate-hidden' + this.state.allTabs[tabIndex].id} className={plateClass}>
        {this.getRenderedElements(tabIndex)}
      </div>)
    })

    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    return <div className={treeContentClasses}>
      <div className="vcv-ui-editor-tabs-container">
        <nav className="vcv-ui-editor-tabs">
          {visibleTabsHeaderOutput}
          {hiddenTabsHeaderOutput}
          <span className="vcv-ui-editor-tabs-free-space"></span>
        </nav>
      </div>

      <div ref="scrollable" className="vcv-ui-tree-content-section">
        <div className="vcv-ui-editor-plates-container">
          <div className="vcv-ui-editor-plates">
            {visibleTabsContentOutput}
            {hiddenTabsContentOutput}
          </div>
        </div>
      </div>
    </div>
  }
}

Categories.propTypes = {
  api: React.PropTypes.object.isRequired,
  elements: React.PropTypes.array.isRequired
}

module.exports = Categories
