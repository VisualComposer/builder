import React from 'react'
import AddElementPanel from '../addElement/addElementPanel'
import AddTemplatePanel from '../addTemplate/addTemplatePanel'
import AddBlockPanel from '../addBlock/addBlockPanel'
import PanelNavigation from '../panelNavigation'
import Search from './lib/search'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const dataManager = vcCake.getService('dataManager')
const roleManager = vcCake.getService('roleManager')
const workspaceStorage = vcCake.getStorage('workspace')
const hubElementsStorage = vcCake.getStorage('hubElements')
const hubTemplatesStorage = vcCake.getStorage('hubTemplates')
const workspaceSettings = workspaceStorage.state('settings')
const workspaceContentState = workspaceStorage.state('content')

export default class AddContentPanel extends React.Component {
  static localizations = dataManager.get('localizations')

  iframe = document.getElementById('vcv-editor-iframe')

  constructor (props) {
    super(props)

    this.state = {
      searchValue: '',
      isRemoveStateActive: workspaceStorage.state('isRemoveStateActive').get() || false,
      isVisible: workspaceContentState.get() === props.activeTab
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.setFirstElement = this.setFirstElement.bind(this)
    this.scrollToElementInsideFrame = this.scrollToElementInsideFrame.bind(this)
    this.handleSettingsClick = this.handleSettingsClick.bind(this)
    this.handleRemoveStateChange = this.handleRemoveStateChange.bind(this)
    this.setVisibility = this.setVisibility.bind(this)

    workspaceStorage.state('isRemoveStateActive').onChange(this.handleRemoveStateChange)
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setVisibility)
  }

  componentWillUnmount () {
    workspaceStorage.state('isRemoveStateActive').ignoreChange(this.handleRemoveStateChange)
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === this.props.activeTab,
      searchValue: ''
    })
  }

  handleRemoveStateChange (newState) {
    this.setState({ isRemoveStateActive: newState })
  }

  setActiveSection (type) {
    const action = type !== 'addElement' ? type : 'add'

    workspaceSettings.set({
      action: action,
      element: {},
      tag: '',
      options: {}
    })
  }

  handleSearch (value) {
    this.setState({
      searchValue: value
    })
  }

  setFirstElement (isReset) {
    const elementValue = isReset ? '' : this.state.searchValue
    this.setState({ applyFirstElement: elementValue })
  }

  scrollToElementInsideFrame (id, isElement) {
    const iframeDocument = this.iframe.contentWindow.document
    const editorEl = iframeDocument.querySelector(`#el-${id}`)
    if (!editorEl) {
      return
    }

    const scrollProps = { behavior: 'smooth' }
    if (isElement) {
      scrollProps.block = 'center'
    }

    window.setTimeout(() => {
      editorEl.scrollIntoView(scrollProps)
    }, 500)
  }

  handleSettingsClick () {
    workspaceStorage.state('isRemoveStateActive').set(!this.state.isRemoveStateActive)
  }

  handleClickCloseContent (e) {
    e && e.preventDefault()
    workspaceSettings.set(false)
  }

  render () {
    const controls = {}

    if (roleManager.can('editor_content_element_add', roleManager.defaultTrue())) {
      controls.addElement = {
        index: 0,
        type: 'addElement',
        title: AddContentPanel.localizations ? AddContentPanel.localizations.elements : 'Elements',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentElements : 'Search for content elements'
      }
    }

    if (roleManager.can('editor_content_template_add', roleManager.defaultTrue())) {
      controls.addTemplate = {
        index: 1,
        type: 'addTemplate',
        title: AddContentPanel.localizations ? AddContentPanel.localizations.templates : 'Templates',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentTemplates : 'Search for templates'
      }
    }

    if (roleManager.can('editor_content_block_add', roleManager.defaultAdmin())) {
      controls.addBlock = {
        index: 2,
        type: 'addBlock',
        title: AddContentPanel.localizations.blocks || 'Blocks',
        searchPlaceholder: AddContentPanel.localizations.searchContentBlocks || 'Search for blocks'
      }
    }

    let content = null
    if (this.props.activeTab === 'addElement' && controls.addElement) {
      content = (
        <AddElementPanel
          key='addElementPanel'
          searchValue={this.state.searchValue}
          applyFirstElement={this.state.applyFirstElement}
          handleScrollToElement={this.scrollToElementInsideFrame}
          setFirstElement={this.setFirstElement}
        />
      )
    } else if (this.props.activeTab === 'addTemplate' && controls.addTemplate) {
      content = (
        <AddTemplatePanel key='addTemplatePanel' searchValue={this.state.searchValue} handleScrollToElement={this.scrollToElementInsideFrame} />
      )
    } else if (this.props.activeTab === 'addBlock' && controls.addBlock) {
      content = (
        <AddBlockPanel key='addBlockPanel' searchValue={this.state.searchValue} handleScrollToElement={this.scrollToElementInsideFrame} />
      )
    }

    const addContentPanelClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-tree-view-content--full-width': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })

    const closeTitle = AddContentPanel.localizations ? AddContentPanel.localizations.close : 'Close'
    const closeTitleWithShortcut = closeTitle + ' (Esc)'
    const manageText = AddContentPanel.localizations ? AddContentPanel.localizations.manageContentInYourLibrary : 'Manage content in your library'

    const settingsTitle = this.state.isRemoveStateActive ? closeTitle : manageText
    const backTitle = AddContentPanel.localizations ? AddContentPanel.localizations.back : 'Back'

    const settingsClasses = classNames({
      'vcv-ui-editor-panel-settings-control': true,
      'vcv-ui-editor-panel-control--active': this.state.isRemoveStateActive
    })

    let settingsControl
    if (
      (
        roleManager.can('editor_content_element_add', roleManager.defaultAdmin()) &&
        (
          // user have access to remove elements
          roleManager.can('hub_elements_templates_blocks', roleManager.defaultAdmin()) ||
          (
            // or user have access to manage presents and there are presets available
            roleManager.can('editor_content_presets_management', roleManager.defaultAdmin()) && hubElementsStorage.state('elementPresets').get().length
          )
        )
      ) || (
        // Must be able to add templates
        roleManager.can('editor_content_template_add', roleManager.defaultAdmin()) &&
        // And must be able to remove templates
        roleManager.can('editor_content_user_templates_management', roleManager.defaultAdmin()) &&
        Object.keys(hubTemplatesStorage.state('templates').get()).length
      )
    ) {
      settingsControl = (
        <span className={settingsClasses} title={settingsTitle} onClick={this.handleSettingsClick}>
          <i className='vcv-ui-icon vcv-ui-icon-cog' />
        </span>
      )
    }

    return (
      <div className={addContentPanelClasses}>
        <div className='vcv-ui-add-content-panel-heading'>
          {this.state.isRemoveStateActive ? (
            <span className='vcv-ui-editor-panel-back-control' onClick={this.handleSettingsClick} title={backTitle}>
              <i className='vcv-ui-icon vcv-ui-icon-chevron-left' />
            </span>
          ) : null}
          <Search
            onSearchChange={this.handleSearch}
            searchValue={this.state.searchValue}
            searchPlaceholder={controls[this.props.activeTab]?.searchPlaceholder}
            setFirstElement={this.setFirstElement}
            autoFocus={this.state.isVisible}
          />
          <div className='vcv-ui-add-content-panel-heading-controls'>
            {settingsControl}
            <span className='vcv-ui-editor-panel-hide-control' title={closeTitleWithShortcut} onClick={this.handleClickCloseContent}>
              <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
            </span>
          </div>
        </div>
        <PanelNavigation controls={controls} activeSection={this.props.activeTab} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          {content}
        </div>
      </div>
    )
  }
}
