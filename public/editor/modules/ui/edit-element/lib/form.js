/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import classNames from 'classnames'
import TreeContentTab from './tab'
// import DesignOptions from './design-options/design-options'
import {format} from 'util'
import DependencyManager from './dependencies'
import EditFormFooter from './footer'
import EditFormContent from './content'
import vcCake from 'vc-cake'
const Utils = vcCake.getService('utils')

class EditForm extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired
  }
  state = {
    activeTabIndex: 0,
    saving: false,
    saved: false
  }
  allTabs = []
  // designOptions = {}

  componentWillMount () {
    this.allTabs = EditForm.updateTabs(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.allTabs = EditForm.updateTabs(nextProps)
    // this.designOptions = vcCake.getService('assets-manager').getDesignOptions()[ nextProps.element.get('id') ]
  }

  updateElement (data) {
    this.props.element.set(data.key, data.value)
  }

  componentDidMount () {
    this.props.api.notify('form:mount')

    this.props.api.on('element:set', this.updateElement.bind(this))
    // this.designOptions = vcCake.getService('assets-manager').getDesignOptions()[ this.props.element.get('id') ]
    Utils.addResizeListener(ReactDOM.findDOMNode(this.refs[ 'editorTabsFreeSpace' ]), this.handleElementResize)
  }

  componentWillUnmount () {
    Utils.removeResizeListener(ReactDOM.findDOMNode(this.refs[ 'editorTabsFreeSpace' ]), this.handleElementResize)
    this.props.api.off('element:set', this.updateElement.bind(this))
  }

  handleElementResize = (e) => {
    this.refreshTabs()
  }

  static updateTabs (props) {
    let tabs = []
    EditForm.editFormTabs(props).map((tab, index) => {
      let tabsData = {
        id: tab.key,
        index: index,
        data: tab.data,
        isVisible: true,
        pinned: tab.data.settings.options && tab.data.settings.options.pinned ? tab.data.settings.options.pinned : false,
        params: EditForm.editFormTabParams(props, tab.key),
        key: `edit-form-tab-${tab.key}`,
        changeTab: this.changeActiveTab
      }
      tabs.push(tabsData)
    }, EditForm)
    /*
     tabs.push({
     id: 'editFormTabDesignOptions',
     index: tabs.length,
     data: {
     settings: {
     options: {
     label: 'Design Options'
     }
     }
     },
     isVisible: true,
     pinned: false,
     params: [],
     key: 'edit-form-tab-design-options',
     changeTab: this.changeActiveTab
     })
     */
    return tabs
  }

  changeActiveTab = (tabIndex) => {
    this.setState({
      activeTabIndex: tabIndex
    })
  }
  /*
   changeDesignOption = (newDesignOptions) => {
   this.designOptions = newDesignOptions
   }
   */
  static editFormTabs (props) {
    const group = props.element.get('metaEditFormTabs')
    if (group && group.each) {
      return group.each(EditForm.editFormTabsIterator.bind(this, props))
    }
    return []
  }

  static editFormTabsIterator (props, item) {
    return {
      key: item,
      value: props.element.get(item),
      data: props.element.settings(item)
    }
  }

  static editFormTabParams (props, tabName) {
    const value = props.element.get(tabName)
    const settings = props.element.settings(tabName)
    if (settings.settings.type === 'group' && value && value.each) {
      return value.each(EditForm.editFormTabsIterator.bind(this, props))
    }
    // In case if tab is single param holder
    return [ {
      key: tabName,
      value: value,
      data: settings
    } ]
  }

  getVisibleTabs () {
    return this.allTabs.filter((tab) => {
      if (tab.isVisible) {
        return true
      }
    })
  }

  getActiveTabContent () {
    let { activeTabIndex } = this.state
    let activeTabContentOutput
    this.allTabs.some((tab) => {
      if (tab.index === activeTabIndex) {
        let plateClass = classNames({
          'vcv-ui-editor-plate': true,
          'vcv-ui-state--active': true
        }, `vcv-ui-editor-plate-${tab.id}`)
        activeTabContentOutput = (
          <div key={'plate-visible' + this.allTabs[ tab.index ].id} className={plateClass}>
            {this.getForm(tab.index)}
          </div>
        )
        return true
      }
      return false
    })

    return activeTabContentOutput
  }

  getHiddenTabs () {
    let tabs = this.allTabs.filter((tab) => {
      return !tab.isVisible
    })
    // tabs.reverse()
    return tabs
  }

  getVisibleAndUnpinnedTabs () {
    return this.getVisibleTabs().filter((tab) => {
      return tab.isVisible && !tab.pinned
    })
  }

  refreshTabs () {
    // get tabs line width
    let $freeSpaceEl = ReactDOM.findDOMNode(this.refs[ 'editorTabsFreeSpace' ])
    let freeSpace = $freeSpaceEl.offsetWidth

    // If there is no space move tab from visible to hidden tabs.
    let visibleAndUnpinnedTabs = this.getVisibleAndUnpinnedTabs()
    if (freeSpace === 0 && visibleAndUnpinnedTabs.length > 0) {
      let lastTab = visibleAndUnpinnedTabs.pop()
      this.allTabs[ lastTab.index ].isVisible = false
      this.forceUpdate()
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
        freeSpace -= lastTab.ref.getRealWidth()
        if (freeSpace > 0) {
          this.allTabs[ lastTab.index ].isVisible = true
        }
      }
      this.forceUpdate()
    }
  }

  getForm (tabIndex) {
    let tab = this.allTabs[ tabIndex ]
    /*  if (tab.id === 'editFormTabDesignOptions') {
     let props = {
     changeDesignOption: this.changeDesignOption,
     values: this.designOptions
     }

     return <DesignOptions {...props} />
     }
     */
    return tab.params.map(this.getFormParamField.bind(this, tabIndex))
  }

  getFormParamField (tabIndex, param) {
    let { element } = this.props
    const updater = (key, value) => {
      this.props.api.notify('element:set', { key: key, value: value })
    }
    return this.field(element, param.key, updater, tabIndex)
  }

  closeTreeView = () => {
    this.props.api.notify('hide')
    this.props.api.request('bar-content-start:hide')
  }

  onSave = () => {
    let { element, api } = this.props
    api.request('data:update', element.get('id'), element.toJS(true))
    // vcCake.getService('assets-manager').addDesignOption(element.get('id'), this.designOptions)
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
    let tab = this.allTabs[ tabIndex ]

    return {
      key: tab.id,
      id: tab.id,
      index: tab.index,
      active: (activeTabIndex === tab.index),
      changeTab: this.changeActiveTab,
      data: tab.data,
      ref: (ref) => {
        if (this.allTabs[ tab.index ]) {
          this.allTabs[ tab.index ].ref = ref
        }
      },
      getContainer: () => {
        return ReactDOM.findDOMNode(this.refs[ 'editorTabs' ])
      }
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
          api={this.props.api}
        />
        {description}
      </div>
    )
    let data = {
      key: key,
      options: options,
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
              <i className="vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-more-dots" />
            </span>
          </dt>
          <dd className="vcv-ui-editor-tab-dropdown-content">
            {hiddenTabsHeader}
          </dd>
        </dl>
      )
    }

    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    return (
      <div className="vcv-ui-tree-view-content">
        <div className={treeContentClasses}>
          <div className="vcv-ui-editor-tabs-container">
            <nav ref="editorTabs" className="vcv-ui-editor-tabs">
              {visibleTabsHeaderOutput}
              {hiddenTabsHeaderOutput}
              <span ref="editorTabsFreeSpace" className="vcv-ui-editor-tabs-free-space" />
            </nav>
          </div>

          <EditFormContent plateContent={this.getActiveTabContent()} />

          <EditFormFooter
            onSave={this.onSave}
            saving={this.state.saving}
            saved={this.state.saved}
          />
        </div>
      </div>
    )
  }
}

export default EditForm
