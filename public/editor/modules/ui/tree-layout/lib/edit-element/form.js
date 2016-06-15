/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var ReactDom = require('react-dom')
var lodash = require('lodash')
var classNames = require('classnames')
var TreeContentTab = require('./tab')
require('../../css/tree-view/init.less')
// var PerfectScrollbar = require('perfect-scrollbar')
// var ReactDOM = require('react-dom')

var TreeContent = React.createClass({
  propTypes: {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.bool ])
  },
  tabsBD: {},
  options: {
    forceRefresh: false
  },

  getInitialState: function () {
    return {
      activeTab: 'content-tab-1',
      visibleTabs: [
        {
          id: 'content-tab-' + 1,
          title: 'General',
          pinned: false
        }
      ],
      hiddenTabs: []
    }
  },
  componentDidMount: function () {
    this.props.api.reply('element:set', function (key, value) {
      this.props.element.set(key, value)
    }.bind(this))
    window.addEventListener('resize', this.refreshTabs)
    setTimeout(this.refreshTabs, 100)

    this.props.api.module('ui-navbar').on('resize', this.refreshTabs)
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize', this.refreshTabs)
  },
  componentDidUpdate: function (prevProps, prevState) {
    // this.refs.scrollable && PerfectScrollbar.initialize(ReactDOM.findDOMNode(this.refs.scrollable))
    if (this.options.forceRefresh === true) {
      this.options.forceRefresh = false
      this.refreshTabs()
    }
  },

  changeActiveTab: function (tabId) {
    this.setState({
      activeTab: tabId
    })
  },

  putTabToDrop: function (tabsCount) {
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
  },
  popTabFromDrop: function (tabsCount) {
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
  },

  refreshTabs: function () {
    if (this.props.element === false) {
      return false
    }
    // get tabs line width
    let $tabsLine = ReactDom.findDOMNode(this).querySelector('.vcv-ui-editor-tabs')
    let $freeSpaceEl = $tabsLine.querySelector('.vcv-ui-editor-tabs-free-space')
    let visibleAndUnpinnedTabs = this.state.visibleTabs.filter(function (tab) {
      return !tab.pinned
    })
    // if there is no space move tab from visible to hidden tabs
    if ($freeSpaceEl.offsetWidth === 0 && visibleAndUnpinnedTabs.length > 0) {
      this.options.forceRefresh = true
      this.putTabToDrop()
      return
    }
    // if we have free space move tab from hidden tabs to visible
    if (this.state.hiddenTabs.length > 0) {
      let freeSpace = $freeSpaceEl.offsetWidth
      let tabsCount = 0

      while (freeSpace > 0 && tabsCount < this.state.hiddenTabs.length) {
        let lastTabId = this.state.hiddenTabs[ tabsCount ].id
        let lastTab = this.tabsBD[ lastTabId ]

        if (lastTab && (lastTab.getRealWidth() + 5 < freeSpace)) {
          freeSpace -= lastTab.getRealWidth()
          tabsCount++
        } else {
          freeSpace = 0
        }
      }
      if (tabsCount) {
        this.popTabFromDrop(tabsCount)
      }
    }
  },
  getForm: function () {
    return this.props.element.publicKeys().map(function (k) {
      let updater = lodash.curry(function (callback, event, key, value) { callback(event, key, value) })
      return this.props.element.field(k, updater(this.props.api.request, 'element:set'))
    }.bind(this))
  },
  closeForm: function () {
    this.props.api.notify('form:hide', false)
  },
  closeTreeView: function () {
    this.props.api.notify('hide', false)
  },
  toggleTreeView: function (e) {
    e.preventDefault()
    this.props.api.notify('tree:toggle')
  },
  saveForm: function () {
    var element = this.props.element
    this.props.api.request('data:update', element.get('id'), element.toJS(true))
    this.closeTreeView()
  },
  render: function () {
    let { activeTab, visibleTabs, hiddenTabs } = this.state

    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })
    if (this.props.element === false) {
      return <div className={treeContentClasses}></div>
    }
    let dropdownClasses = classNames({
      'vcv-ui-editor-tab-dropdown': true,
      'vcv-ui-active': !!hiddenTabs.filter(function (value) {
        return value.id === activeTab
      }).length
    })

    function getTabProps (tab, activeTab, context) {
      return {
        key: tab.id,
        id: tab.id,
        title: tab.title,
        active: (activeTab === tab.id),
        container: '.vcv-ui-editor-tabs',
        ref: (ref) => { context.tabsBD[ tab.id ] = ref },
        changeActive: context.changeActiveTab
      }
    }

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

          {visibleTabs.map((tab, i) => {
            let { ...tabProps } = getTabProps(tab, activeTab, this)
            return (
              <TreeContentTab {...tabProps} />
            )
          })
          }
          {(() => {
            if (hiddenTabs.length) {
              return <dl className={dropdownClasses}>
                <dt className="vcv-ui-editor-tab-dropdown-trigger vcv-ui-editor-tab" title="More">
                  <span className="vcv-ui-editor-tab-content">
                    <i className="vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-more-dots"></i>
                  </span>
                </dt>
                <dd className="vcv-ui-editor-tab-dropdown-content">
                  {hiddenTabs.map((tab, i) => {
                    let { ...tabProps } = getTabProps(tab, activeTab, this)
                    return (
                      <TreeContentTab {...tabProps} />
                    )
                  })
                  }
                </dd>
              </dl>
            }
          })()}
          <span className="vcv-ui-editor-tabs-free-space"></span>
        </nav>
      </div>

      <div ref="scrollable" className="vcv-ui-tree-content-section">

        <div className="vcv-ui-editor-plates-container">
          <div className="vcv-ui-editor-plates">
            {visibleTabs.map((tab, i) => {
              let plateClass = 'vcv-ui-editor-plate'
              if (tab.id === this.state.activeTab) {
                plateClass += ' vcv-ui-active'
              }
              return (<div key={'plate' + tab.id} className={plateClass}>
                {this.getForm()}
              </div>)
            }, this)
            }
            {hiddenTabs.map((tab, i) => {
              let plateClass = 'vcv-ui-editor-plate'
              if (tab.id === this.state.activeTab) {
                plateClass += ' vcv-ui-active'
              }
              return (<div key={'plate' + tab.id} className={plateClass}>
                tab content {tab.id}
              </div>)
            }, this)
            }
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
})
module.exports = TreeContent
