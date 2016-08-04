/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import TreeContentTab from './tab'
import DesignOptions from './design-options/design-options'
import {getService} from 'vc-cake'
import {format} from 'util'
import DependencyManager from './dependencies'

// import PerfectScrollbar from 'perfect-scrollbar'
let allTabs = []
let designOptions = {}

class TreeForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      tabsCount: 0,
      visibleTabsCount: 0,
      activeTabIndex: 0,
      saving: false,
      saved: false
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

  updateElement (data) {
    this.props.element.set(data.key, data.value)
  }

  componentDidMount () {
    this.props.api.notify('form:mount')

    this.props.api.on('element:set', this.updateElement.bind(this))
    designOptions = getService('assets-manager').getDesignOptions()[ this.props.element.get('id') ]
    this.addResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs-free-space'), this.handleElementResize)
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs-free-space'), this.handleElementResize)
    this.props.api.off('element:set', this.updateElement.bind(this))
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = (e) => {
      obj.contentDocument.defaultView.addEventListener('resize', fn)
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
    this.editFormTabs().map((tab, index) => {
      let tabsData = {
        id: tab.key,
        index: index,
        title: tab.data.settings.options.label,
        isVisible: true,
        pinned: tab.data.settings.options.pinned || false,
        params: this.editFormTabParams(tab.key)
      }
      tabs.push(tabsData)
    }, this)

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

  editFormTabs () {
    const group = this.props.element.get('editFormTabs')
    if (group && group.each) {
      return group.each(this.editFormTabsIterator.bind(this))
    }
    return []
  }

  editFormTabsIterator (item) {
    return {
      key: item,
      value: this.props.element.get(item),
      data: this.props.element.settings(item)
    }
  }

  editFormTabParams (tabName) {
    const group = this.props.element.get(tabName)
    if (group && group.each) {
      return group.each(this.editFormTabsIterator.bind(this))
    }
    return []
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
    return tab.params.map(this.getFormParamField.bind(this, tabIndex))
  }

  getFormParamField (tabIndex, param) {
    let { element } = this.props
    const updater = (key, value) => {
      this.props.api.notify('element:set', { key: key, value: value })
    }
    return this.field(element, param.key, updater, tabIndex)
  }

  closeTreeView () {
    this.props.api.notify('hide')
    this.props.api.request('bar-content-start:hide')
  }

  saveForm () {
    let { element, api } = this.props
    api.request('data:update', element.get('id'), element.toJS(true))
    getService('assets-manager').addDesignOption(element.get('id'), designOptions)
    this.setState({ 'saving': true })
    setTimeout(() => {
      this.setState({ 'saving': false })
      this.setState({ 'saved': true })
      setTimeout(() => {
        this.setState({ 'saved': false })
      }, 1000)
    }, 500)
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
      changeActive: this.changeActiveTab.bind(this)
    }
  }

  field (element, key, updater, tabIndex) {
    let { type, settings } = element.settings(key)
    let AttributeComponent = type.component
    if (!AttributeComponent) {
      return null
    }
    let label = ''
    if (!settings) {
      throw new Error(format('Wrong attribute %s', key))
    }
    const { options } = settings
    if (!type) {
      throw new Error(format('Wrong type of attribute %s', key))
    }
    if (options && typeof (options.label) === 'string') {
      label = (<span className="vcv-ui-form-group-heading">{options.label}</span>)
    }
    let description = ''
    if (options && typeof (options.description) === 'string') {
      description = (<p className="vcv-ui-form-helper">{options.description}</p>)
    }
    let rawValue = type.getRawValue(element.data, key)
    let value = type.getValue(settings, element.data, key)
    let content = (
      <div className="vcv-ui-form-group" key={'form-group-' + key}>
        {label}
        <AttributeComponent
          key={'attribute-' + key + element.get('id')}
          fieldKey={key}
          options={options}
          value={rawValue}
          updater={updater}
        />
        {description}
      </div>
    )
    let data = {
      key: key,
      options: options,
      label: label,
      description: description,
      type: type,
      value: value,
      rawValue: rawValue,
      updater: updater,
      getRef: (key) => {
        return this.refs[ 'form-element-' + key ]
      },
      tabIndex: tabIndex,
      getRefTab: (index) => {
        return this.refs[ 'form-tab-' + index ]
      }
    }

    return (
      <DependencyManager
        ref={'form-element-' + key}
        key={'dependency-' + key}
        api={this.props.api}
        data={data}
        element={this.props.element}
        content={content} />
    )
  }

  render () {
    let { activeTabIndex } = this.state
    let visibleTabsHeaderOutput = []
    lodash.each(this.getVisibleTabs(), (tab) => {
      let { ...tabProps } = this.getTabProps(tab.index, activeTabIndex)
      visibleTabsHeaderOutput.push(
        <TreeContentTab ref={'form-tab-' + tab.index} {...tabProps} />
      )
    })
    let hiddenTabsHeaderOutput = ''
    if (this.getHiddenTabs().length) {
      let hiddenTabsHeader = []
      lodash.each(this.getHiddenTabs(), (tab) => {
        let { ...tabProps } = this.getTabProps(tab.index, activeTabIndex)
        hiddenTabsHeader.push(
          <TreeContentTab ref={'form-tab-' + tab.index} {...tabProps} />
        )
      })

      let dropdownClasses = classNames({
        'vcv-ui-editor-tab-dropdown': true,
        'vcv-ui-state--active': !!this.getHiddenTabs().filter((tab) => {
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
    let visibleTabsContentOutput = []
    lodash.each(this.getVisibleTabs(), (tab) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tab.index === activeTabIndex) {
        plateClass += ' vcv-ui-state--active'
      }
      visibleTabsContentOutput.push(<div key={'plate-visible' + allTabs[ tab.index ].id} className={plateClass}>
        {this.getForm(tab.index)}
      </div>)
    })

    let hiddenTabsContentOutput = []
    lodash.each(this.getHiddenTabs(), (tab) => {
      let plateClass = 'vcv-ui-editor-plate'
      if (tab.index === activeTabIndex) {
        plateClass += ' vcv-ui-state--active'
      }
      visibleTabsContentOutput.push(<div key={'plate-hidden' + allTabs[ tab.index ].id} className={plateClass}>
        {this.getForm(tab.index)}
      </div>)
    })

    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })
    let saveButtonClasses = classNames({
      'vcv-ui-tree-layout-action': true,
      'vcv-ui-state--success': this.state.saved
    })
    let saveIconClasses = classNames({
      'vcv-ui-tree-layout-action-icon': true,
      'vcv-ui-wp-spinner': this.state.saving,
      'vcv-ui-icon': !this.state.saving,
      'vcv-ui-icon-save': !this.state.saving
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

    return (
      <div className="vcv-ui-tree-view-content">
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
              <a className={saveButtonClasses} href="#" title="Save" onClick={this.saveForm}>
                <span className="vcv-ui-tree-layout-action-content">
                  <i className={saveIconClasses}></i><span>Save</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
TreeForm.propTypes = {
  api: React.PropTypes.object.isRequired,
  element: React.PropTypes.object.isRequired
}

module.exports = TreeForm
