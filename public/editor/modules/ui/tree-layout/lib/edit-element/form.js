/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import TreeContentTab from './tab'
import '../../css/tree-view/init.less'

// import PerfectScrollbar from 'perfect-scrollbar'

class TreeForm extends React.Component {

  constructor () {
    super()
    this.state = {
      activeTabIndex: 0,
      allTabs: [],
      visibleTabs: [],
      hiddenTabs: [],
      forceRefresh: false
    }
  }

  componentDidMount () {
    this.props.api.reply('element:set', function (key, value) {
      this.props.element.set(key, value)
    }.bind(this))
    window.addEventListener('resize', this.refreshTabs.bind(this))
    setTimeout(this.refreshTabs.bind(this), 100)
    this.props.api.module('ui-navbar').on('resize', this.refreshTabs.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.refreshTabs.bind(this))
  }

  componentDidUpdate (prevProps, prevState) {
    this.refreshTabs()
  }

  componentWillReceiveProps (nextProps) {
    var allTabs = this.tabsFromProps(nextProps)
    this.setState({
      allTabs: allTabs.slice(),
      visibleTabs: [],
      hiddenTabs: allTabs.slice(),
      activeTabIndex: 0
    })
  }

  tabsFromProps (props) {
    let tabs = []
    if (props.element) {
      props.element.editFormTabs().map((tab, index) => {
        let tabsData = {
          id: tab.key,
          index: index,
          title: tab.data.settings.options.label,
          pinned: tab.data.settings.options.pinned || false,
          params: props.element.editFormTabParams(tab.key)
        }
        tabs.push(tabsData)
      })
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
      for (let i = prevState.visibleTabs.length - 1; i >= 0; i--) {
        let tab = prevState.visibleTabs[ i ]
        if (tab.pinned) {
          continue
        }
        tab.originalPositionFromEnd = prevState.visibleTabs.length - i
        prevState.visibleTabs.splice(i, 1)
        prevState.hiddenTabs.unshift(tab)
        if (--tabsCount === 0) {
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
      while (tabsCount > 0) {
        let tab = prevState.hiddenTabs.shift()
        let position = prevState.visibleTabs.length - tab.originalPositionFromEnd + 1
        prevState.visibleTabs.splice(position, 0, tab)
        tabsCount--
      }
      return prevState
    })
  }

  refreshTabs () {
    if (this.props.element === false) {
      return false
    }
    // get tabs line width
    let $tabsLine = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs')
    let $freeSpaceEl = $tabsLine.querySelector('.vcv-ui-editor-tabs-free-space')
    let visibleAndUnpinnedTabs = this.state.visibleTabs.filter(function (tab) {
      return !tab.pinned
    })
    // if there is no space move tab from visible to hidden tabs
    if ($freeSpaceEl.offsetWidth === 0 && visibleAndUnpinnedTabs.length > 0) {
      this.setState({ forceRefresh: true })
      this.putTabToDrop()
      return
    }
    // if we have free space move tab from hidden tabs to visible
    if (this.state.hiddenTabs.length > 0) {
      let freeSpace = $freeSpaceEl.offsetWidth
      let tabsCount = 0

      while (freeSpace > 0 && tabsCount < this.state.hiddenTabs.length) {
        let lastTabIndex = this.state.hiddenTabs[ tabsCount ].index
        let lastTab = this.state.allTabs[ lastTabIndex ]

        if (lastTab && (lastTab.ref.getRealWidth() + 5 < freeSpace)) {
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

  getForm (tabs, tabIndex) {
    return tabs[ tabIndex ].params.map(this.getFormParamField.bind(this))
  }

  getFormParamField (param) {
    let updater = lodash.curry((callback, event, key, value) => { callback(event, key, value) })
    return this.props.element.field(param.key, updater(this.props.api.request, 'element:set'))
  }

  closeForm () {
    this.props.api.notify('form:hide', false)
  }

  closeTreeView () {
    this.props.api.notify('hide', false)
  }

  toggleTreeView (e) {
    e && e.preventDefault && e.preventDefault()
    this.props.api.notify('tree:toggle')
  }

  saveForm () {
    var element = this.props.element
    this.props.api.request('data:update', element.get('id'), element.toJS(true))
    this.closeTreeView()
  }

  getTabProps (tab, activeTabIndex) {
    return {
      key: tab.id,
      id: tab.id,
      index: tab.index,
      title: tab.title,
      active: (activeTabIndex === tab.index),
      container: '.vcv-ui-editor-tabs',
      ref: (ref) => {
        this.state.allTabs[ tab.index ].ref = ref
      },
      changeActive: this.changeActiveTab.bind(this)
    }
  }

  render () {
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    if (this.props.element === false) {
      return <div className={treeContentClasses}></div>
    }

    let { activeTabIndex, visibleTabs, hiddenTabs } = this.state

    let dropdownClasses = classNames({
      'vcv-ui-editor-tab-dropdown': true,
      'vcv-ui-active': !!hiddenTabs.filter(function (value) {
        return value.index === activeTabIndex
      }).length
    })

    var visibleTabsHeaderOutput = []
    lodash.each(visibleTabs, (tab, i) => {
      let { ...tabProps } = this.getTabProps(tab, activeTabIndex)
      visibleTabsHeaderOutput.push(
        <TreeContentTab {...tabProps} />
      )
    })
    var hiddenTabsHeaderOutput = ''
    if (hiddenTabs.length) {
      var hiddenTabsHeader = []
      lodash.each(hiddenTabs, (tab, i) => {
        let { ...tabProps } = this.getTabProps(tab, activeTabIndex)
        hiddenTabsHeader.push(
          <TreeContentTab {...tabProps} />
        )
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
    lodash.each(visibleTabs, (tab, index) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tab.index === activeTabIndex) {
        plateClass += ' vcv-ui-active'
      }
      visibleTabsContentOutput.push(<div key={'plate' + tab.id} className={plateClass}>
        {this.getForm(visibleTabs, index)}
      </div>)
    })

    var hiddenTabsContentOutput = []
    lodash.each(hiddenTabs, (tab) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tab.index === activeTabIndex) {
        plateClass += ' vcv-ui-active'
      }
      visibleTabsContentOutput.push(<div key={'plate' + tab.id} className={plateClass}>
        {this.getForm(hiddenTabs, tab.index)}
      </div>)
    })

    var elementSettings = this.props.element
    return <div className={treeContentClasses}>
      <div className="vcv-ui-tree-content-header">
        <div className="vcv-ui-tree-content-title-bar">
          <i className="vcv-ui-tree-content-title-icon vcv-ui-icon vcv-ui-icon-bug"></i>
          <h3 className="vcv-ui-tree-content-title">
            {elementSettings ? elementSettings.get('name') : null}
          </h3>
          <nav className="vcv-ui-tree-content-title-controls">
            <a className="vcv-ui-tree-content-title-control" href="#" title="document-alt-stroke bug">
              <span className="vcv-ui-tree-content-title-control-content">
                <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-document-alt-stroke"></i>
              </span>
            </a>
            <a className="vcv-ui-tree-content-title-control" href="#" title="heart-stroke bug" disabled="">
              <span className="vcv-ui-tree-content-title-control-content">
                <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-heart-stroke"></i>
              </span>
            </a>
            <a className="vcv-ui-tree-content-title-control" href="#" title="settings bug">
              <span className="vcv-ui-tree-content-title-control-content">
                <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-cog"></i>
              </span>
            </a>
            <a className="vcv-ui-tree-content-title-control" href="#" title="close" onClick={this.closeTreeView}>
              <span className="vcv-ui-tree-content-title-control-content">
                <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-close"></i>
              </span>
            </a>
          </nav>
        </div>
      </div>

      <div className="vcv-ui-editor-tabs-container">
        <nav className="vcv-ui-editor-tabs">
          <a className="vcv-ui-editor-tab vcv-ui-editor-tab-toggle-tree" href="#" title="Toggle tree view"
            onClick={this.toggleTreeView}>
            <span className="vcv-ui-editor-tab-content">
              <i className="vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-layers"></i>
            </span>
          </a>
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

      <div className="vcv-ui-tree-content-footer">
        <div className="vcv-ui-tree-layout-actions">
          <a className="vcv-ui-tree-layout-action" href="#" title="Close" onClick={this.closeTreeView}>
            <span className="vcv-ui-tree-layout-action-content">
              <i className="vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-close"></i>
              <span>Close</span>
            </span>
          </a>
          <a className="vcv-ui-tree-layout-action" href="#" title="Save" onClick={this.saveForm}>
            <span className="vcv-ui-tree-layout-action-content">
              <i className="vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-save"></i>
              <span>Save</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  }
}
/*
TreeForm.propTypes = {
  api: React.PropTypes.object.isRequired,
  element: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.bool ])
}*/

module.exports = TreeForm