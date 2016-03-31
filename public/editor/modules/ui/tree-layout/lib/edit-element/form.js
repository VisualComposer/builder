var vcCake = require('vc-cake');
var React = require('react');
var ReactDom = require('react-dom');

var classNames = require('classnames');
var TreeContentTab = require('./tab');
var ElementComponents = vcCake.getService('element').components;
var EditFormElement = require('./edit-form-element');
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
    if (false === this.props.id) {
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
  getSettings: function() {
    var element = this.getElement();
    return ElementComponents.get(element.tag);
  },
  getElement: function() {
    return this.props.api.getService('document').get(this.props.id);
  },
  getForm: function() {
    console.log('getForm called');
    var element = this.getElement();
    var settings = this.getSettings();
    var returnList = [];
    var settingsKeys = Object.keys(settings);
    if (settingsKeys.length) {
      returnList = settingsKeys.map(function(key) {
        var paramSettings = settings[key];
        if ('public' === paramSettings.getAccess()) {
          var isVisible = typeof this.state['editFormElementsVisible' + key] !== 'undefined' ? this.state['editFormElementsVisible' + key] : true;
          return (
            <EditFormElement
              key={['vc-v-edit-form-element-' , key]}
              paramSettings={paramSettings}
              editElement={element}
              paramKey={key}
              toggleVisible={this.toggleVisible}
              isVisible={isVisible}
              onSaveItemsAdd={this.onSaveItemsAdd}
              onCancelItemsAdd={this.onCancelItemsAdd}
              onValidateItemsAdd={this.onValidateItemsAdd}
              closeModal={this.closeModal}
            />
          );
        }
      }, this).filter(i=>i);
    }
    if (!returnList.length) {
      this.closeImmediately = true;
    }
    return returnList;
  },
  closeForm: function() {
    this.props.api.notify('form:hide', false);
  },
  closeTreeView: function() {
    this.props.api.notify('hide', false);
  },
  saveForm: function() {
    this.closeForm();
  },
  render: function() {
    let {activeTab, visibleTabs, hiddenTabs} = this.state;

    let treeContentClasses = classNames({
      "vc-ui-tree-content": true
    });
    if(false === this.props.id) {
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
      }
    }
    var element = this.props.api.getService('document').get(this.props.id);
    var elementSettings = element ? ElementComponents.get(element.tag) : null;
    return (
      <div className={treeContentClasses}>
        <div className="vc-ui-tree-content-header">
          <div className="vc-ui-tree-content-title-bar">
            <i className="vc-ui-tree-content-title-icon vc-ui-icon vc-ui-icon-bug"></i>
            <h3 className="vc-ui-tree-content-title">
              {elementSettings ? elementSettings.name.toString() : null}
            </h3>
            <nav className="vc-ui-tree-content-title-controls">
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug"><span
                className="vc-ui-tree-content-title-control-content"><i
                className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-document-alt-stroke"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug" disabled=""><span
                className="vc-ui-tree-content-title-control-content"><i
                className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-heart-stroke"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug"><span
                className="vc-ui-tree-content-title-control-content"><i
                className="vc-ui-tree-content-title-control-icon vc-ui-icon vc-ui-icon-cog"></i></span></a>
              <a className="vc-ui-tree-content-title-control" href="#" title="title bug" onClick={this.closeTreeView}><span
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
      </div>
    );
  }
});

module.exports = TreeContent;