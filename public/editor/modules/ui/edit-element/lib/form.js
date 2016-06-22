/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import TreeContentTab from './tab'
import '../css/tree-view/init.less'

// import PerfectScrollbar from 'perfect-scrollbar'

class TreeForm extends React.Component {

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
    this.props.api.reply('element:set', function (key, value) {
      this.props.element.set(key, value)
    }.bind(this))
    window.addEventListener('resize', this.refreshTabs.bind(this))
    this.props.api.module('ui-navbar').on('resize', this.refreshTabs.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.refreshTabs)
  }

  componentDidUpdate (prevProps, prevState) {
    // TODO: Make performance checks
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
    // get tabs line width
    let $tabsLine = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs')
    let $freeSpaceEl = $tabsLine.querySelector('.vcv-ui-editor-tabs-free-space')
    let freeSpace = $freeSpaceEl.offsetWidth
    let visibleAndUnpinnedTabs = this.getVisibleAndUnpinnedTabs()
    // if there is no space move tab from visible to hidden tabs
    if (freeSpace === 0 && visibleAndUnpinnedTabs.length > 0) {
      this.putTabToDrop()
      return
    }
    // if we have free space move tab from hidden tabs to visible
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

  getForm (tabIndex) {
    return this.state.allTabs[ tabIndex ].params.map(this.getFormParamField.bind(this))
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
    let element = this.props.element
    this.props.api.request('data:update', element.get('id'), element.toJS(true))
    this.closeTreeView()
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
        this.state.allTabs[ tab.index ].ref = ref
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
        <TreeContentTab {...tabProps} />
      )
    })
    var hiddenTabsHeaderOutput = ''
    if (hiddenTabsIndexes.length) {
      var hiddenTabsHeader = []
      lodash.each(hiddenTabsIndexes, (tabIndex) => {
        let { ...tabProps } = this.getTabProps(tabIndex, activeTabIndex)
        hiddenTabsHeader.push(
          <TreeContentTab {...tabProps} />
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
        {this.getForm(tabIndex)}
      </div>)
    })

    var hiddenTabsContentOutput = []
    lodash.each(hiddenTabsIndexes, (tabIndex) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tabIndex === activeTabIndex) {
        plateClass += ' vcv-ui-active'
      }
      visibleTabsContentOutput.push(<div key={'plate-hidden' + this.state.allTabs[tabIndex].id} className={plateClass}>
        {this.getForm(tabIndex)}
      </div>)
    })

    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    return <div className={treeContentClasses}>
      <div className="vcv-ui-editor-tabs-container">
        <nav className="vcv-ui-editor-tabs">
          <a className="vcv-ui-editor-tab vcv-ui-editor-tab-toggle-tree" href="#" title="Toggle tree view"
            onClick={this.toggleTreeView.bind(this)}>
            <span className="vcv-ui-editor-tab-content">
              <i className="vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-layers"></i>
            </span>
          </a>
          {visibleTabsHeaderOutput}
          {hiddenTabsHeaderOutput}
          <span className="vcv-ui-editor-tabs-free-space"></span>
        </nav>
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
          <a className="vcv-ui-tree-content-title-control" href="#" title="close" onClick={this.closeTreeView.bind(this)}>
            <span className="vcv-ui-tree-content-title-control-content">
              <i className="vcv-ui-tree-content-title-control-icon vcv-ui-icon vcv-ui-icon-close"></i>
            </span>
          </a>
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
          <a className="vcv-ui-tree-layout-action" href="#" title="Close" onClick={this.closeTreeView.bind(this)}>
            <span className="vcv-ui-tree-layout-action-content">
              <i className="vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-close"></i>
              <span>Close</span>
            </span>
          </a>
          <a className="vcv-ui-tree-layout-action" href="#" title="Save" onClick={this.saveForm.bind(this)}>
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

TreeForm.propTypes = {
  api: React.PropTypes.object.isRequired,
  element: React.PropTypes.object.isRequired
}

module.exports = TreeForm
