var vcCake = require('vc-cake');
var React = require('react');
var ReactDom = require('react-dom');
var lodash = require('lodash');
var classNames = require('classnames');
var TreeContentTab = require('./tab');
var cook = vcCake.getService('cook');
require('../../css/tree-view/init.less');

var TreeContent = React.createClass({
  tabsBD: {},
  options: {
    forceRefresh: false
  },

  getInitialState: function() {
    return {
      activeTab: 'content-tab-1',
      visibleTabs: [
        {
          id: 'content-tab-' + 1,
          title: 'General'
        }
      ],
      hiddenTabs: []
    };
  },
  componentDidMount: function() {
    this.props.api.reply('element:set', function(key, value) {
      this.props.element.set(key, value);
    }.bind(this));
    window.addEventListener("resize", this.refreshTabs);
    setTimeout(this.refreshTabs, 100);

    this.props.api.module('ui-navbar').on('resize', this.refreshTabs)
  },
  componentWillUnmount: function() {
    window.removeEventListener("resize", this.refreshTabs);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.options.forceRefresh === true) {
      this.options.forceRefresh = false;
      this.refreshTabs();
    }
  },

  changeActiveTab: function(tabId) {
    this.setState({
      activeTab: tabId
    })
  },

  putTabToDrop: function(tabsCount) {
    if (!tabsCount) {
      tabsCount = 1;
    }
    this.setState(function(prevState) {
      while (tabsCount > 0) {
        prevState.hiddenTabs.unshift(prevState.visibleTabs.pop());
        tabsCount--;
      }
      return prevState
    });
  },
  popTabFromDrop: function(tabsCount) {
    if (!tabsCount) {
      tabsCount = 1;
    }
    this.setState(function(prevState) {
      while (tabsCount > 0) {
        prevState.visibleTabs.push(prevState.hiddenTabs.shift());
        tabsCount--;
      }
      return prevState;
    });
  },

  refreshTabs: function() {
    if (false === this.props.element) {
      return false;
    }
    // get tabs line width
    let $tabsLine = ReactDom.findDOMNode(this).querySelector('.vc-ui-editor-tabs'),
      $freeSpaceEl = $tabsLine.querySelector('.vc-ui-editor-tabs-free-space');

    // if there is no space move tab from visible to hidden tabs
    if ($freeSpaceEl.offsetWidth === 0 && this.state.visibleTabs.length > 0) {
      this.options.forceRefresh = true;
      this.putTabToDrop();
      return;
    }

    // if we have free space move tab from hidden tabs to visible
    if (this.state.hiddenTabs.length > 0) {

      let freeSpace = $freeSpaceEl.offsetWidth,
        tabsCount = 0;

      while (freeSpace > 0 && tabsCount < this.state.hiddenTabs.length) {
        let lastTabId = this.state.hiddenTabs[tabsCount].id,
          lastTab = this.tabsBD[lastTabId];

        if (lastTab && (lastTab.getRealWidth() + 5 < freeSpace)) {
          freeSpace -= lastTab.getRealWidth();
          tabsCount++;
        } else {
          freeSpace = 0;
        }
      }
      if (tabsCount) {
        this.popTabFromDrop(tabsCount);
      }
    }
  },
  getForm: function() {
    return this.props.element.publicKeys().map(((k) => {
      let updater = lodash.curry(function(callback, event, key, value){ callback(event, key, value); });
      return this.props.element.field(k, updater(this.props.api.request, 'element:set'));
    }).bind(this));
  },
  closeForm: function() {
    this.props.api.notify('form:hide', false);
  },
  closeTreeView: function() {
    this.props.api.notify('hide', false);
  },
  saveForm: function() {
    var element = this.props.element;
    this.props.api.request('data:update', element.get('id'), element.toJS());
    this.closeForm();
  },
  render: function() {
    let {activeTab, visibleTabs, hiddenTabs} = this.state;

    let treeContentClasses = classNames({
      "vc-ui-tree-content": true
    });
    if(false === this.props.element) {
      return <div className={treeContentClasses}></div>;
    }
    let dropdownClasses = classNames({
      "vc-ui-editor-tab-dropdown": true,
      "vc-ui-active": !!hiddenTabs.filter(function(value) {
        return value.id == activeTab;
      }).length
    });

    function getTabProps(tab, activeTab, context) {
      return {
        key: tab.id,
        id: tab.id,
        title: tab.title,
        active: (activeTab == tab.id),
        container: ".vc-ui-editor-tabs",
        ref: (ref) => context.tabsBD[tab.id] = ref,
        changeActive: context.changeActiveTab
      };
    }
    var elementSettings = this.props.element;
    return <div className={treeContentClasses}>
        <div className="vc-ui-tree-content-header">
          <div className="vc-ui-tree-content-title-bar">
            <i className="vc-ui-tree-content-title-icon vc-ui-icon vc-ui-icon-bug"></i>
            <h3 className="vc-ui-tree-content-title">
              {elementSettings ? elementSettings.get('name') : null}
            </h3>
            <nav className="vc-ui-tree-content-title-controls">
              <a className="vc-ui-tree-content-title-control" href="#" title="document-alt-stroke bug"><span
                className="vc-ui-tree-content-title-control-content"><i
                className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-document-alt-stroke"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="heart-stroke bug" disabled=""><span
                className="vc-ui-tree-content-title-control-content"><i
                className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-heart-stroke"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="settings bug"><span
                className="vc-ui-tree-content-title-control-content"><i
                className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-cog"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="close" onClick={this.closeTreeView}><span
                className="vc-ui-tree-content-title-control-content"><i
                className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-close"></i></span></a>
            </nav>
          </div>
        </div>

        <div className="vc-ui-editor-tabs-container">
          <nav className="vc-ui-editor-tabs">
            { visibleTabs.map((tab, i) => {
              let {...tabProps} = getTabProps(tab, activeTab, this);
              return (
                <TreeContentTab {...tabProps}/>
              );
            })
            }
            {(() => {
              if (hiddenTabs.length) {
                return <dl className={dropdownClasses}>
                  <dt className="vc-ui-editor-tab-dropdown-trigger vc-ui-editor-tab" title="More">
                    <span className="vc-ui-editor-tab-content"><i
                      className="vc-ui-editor-tab-icon vc-ui-icon vc-ui-icon-more-dots"></i></span>
                  </dt>
                  <dd className="vc-ui-editor-tab-dropdown-content">
                    { hiddenTabs.map((tab, i) => {
                      let {...tabProps} = getTabProps(tab, activeTab, this);
                      return (
                        <TreeContentTab {...tabProps}/>
                      );
                    })
                    }
                  </dd>
                </dl>
              }
            })()}
            <span className="vc-ui-editor-tabs-free-space"></span>
          </nav>
        </div>

        <div className="vc-ui-tree-content-section">

          <div className="vc-ui-editor-plates-container">
            <div className="vc-ui-editor-plates">
              { visibleTabs.map((tab, i) => {
                let plateClass = 'vc-ui-editor-plate';
                if (tab.id === this.state.activeTab) {
                  plateClass += ' vc-ui-active';
                }
                return (<div key={'plate'+tab.id} className={plateClass}>
                  {this.getForm()}
                </div>)
              }, this)
              }
              { hiddenTabs.map((tab, i) => {
                let plateClass = 'vc-ui-editor-plate';
                if (tab.id === this.state.activeTab) {
                  plateClass += ' vc-ui-active';
                }
                return (<div key={'plate'+tab.id} className={plateClass}>
                  tab content {tab.id}
                </div>)
              }, this)
              }
            </div>
          </div>
        </div>

        <div className="vc-ui-tree-content-footer">
          <div className="vc-ui-tree-layout-actions">
            <a className="vc-ui-tree-layout-action" href="#" title="Close" onClick={this.closeForm}><span
              className="vc-ui-tree-layout-action-content"><i
              className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-close"></i></span></a>
            <a className="vc-ui-tree-layout-action" href="#" title="Save" onClick={this.saveForm}><span
              className="vc-ui-tree-layout-action-content"><i
              className="vc-ui-tree-layout-action-icon vc-ui-icon vc-ui-icon-save"></i></span></a>
          </div>
        </div>
      </div>;
  }
});

module.exports = TreeContent;