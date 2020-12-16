import React from 'react'
import AddElementPanel from '../addElement/addElementPanel'
import AddTemplatePanel from '../addTemplate/addTemplatePanel'
import PanelNavigation from '../panelNavigation'
import Scrollbar from '../../scrollbar/scrollbar'
import Search from './lib/search'
import vcCake from 'vc-cake'
import classNames from 'classnames'

const dataManager = vcCake.getService('dataManager')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')

export default class AddContentPanel extends React.Component {
  static localizations = dataManager.get('localizations')

  iframe = document.getElementById('vcv-editor-iframe') && document.getElementById('vcv-editor-iframe').contentWindow.document

  constructor (props) {
    super(props)

    this.state = {
      searchValue: '',
      isRemoveStateActive: workspaceStorage.state('isRemoveStateActive').get() || false
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.setFirstElement = this.setFirstElement.bind(this)
    this.scrollToElementInsideFrame = this.scrollToElementInsideFrame.bind(this)
    this.handleSettingsClick = this.handleSettingsClick.bind(this)
    this.handleRemoveStateChange = this.handleRemoveStateChange.bind(this)

    workspaceStorage.state('isRemoveStateActive').onChange(this.handleRemoveStateChange)
  }

  componentWillUnmount () {
    workspaceStorage.state('isRemoveStateActive').ignoreChange(this.handleRemoveStateChange)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps && nextProps.visible !== this.props.visible) {
      // Reset Search on re-open
      this.setState({
        searchValue: ''
      })
    }
  }

  handleRemoveStateChange (newState) {
    this.setState({ isRemoveStateActive: newState })
  }

  /* eslint-enable */
  setActiveSection (type) {
    const action = type === 'addTemplate' ? 'addTemplate' : 'add'
    workspaceStorage.state('settings').set({
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

  setFirstElement () {
    this.setState({ applyFirstElement: this.state.searchValue })
  }

  scrollToElementInsideFrame (id, isElement) {
    const editorEl = this.iframe.querySelector(`#el-${id}`)
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
    const controls = {
      addElement: {
        index: 0,
        type: 'addElement',
        title: AddContentPanel.localizations ? AddContentPanel.localizations.elements : 'Elements',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentElements : 'Search for content elements'
      },
      addTemplate: {
        index: 1,
        type: 'addTemplate',
        title: AddContentPanel.localizations ? AddContentPanel.localizations.templates : 'Templates',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentTemplates : 'Search for templates'
      }
    }

    let content = null
    if (this.props.activeTab === 'addElement') {
      content = (
        <AddElementPanel key='addElementPanel' options={this.props.options} searchValue={this.state.searchValue} applyFirstElement={this.state.applyFirstElement} handleScrollToElement={this.scrollToElementInsideFrame} />
      )
    } else if (this.props.activeTab === 'addTemplate') {
      content = (
        <AddTemplatePanel key='addTemplatePanel' searchValue={this.state.searchValue} handleScrollToElement={this.scrollToElementInsideFrame} />
      )
    }

    const addContentPanelClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-tree-view-content--full-width': true,
      'vcv-ui-state--hidden': !this.props.visible
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
            searchPlaceholder={controls[this.props.activeTab].searchPlaceholder}
            setFirstElement={this.setFirstElement}
            autoFocus={this.props.visible}
          />
          <div className='vcv-ui-add-content-panel-heading-controls'>
            <span className={settingsClasses} title={settingsTitle} onClick={this.handleSettingsClick}>
              <i className='vcv-ui-icon vcv-ui-icon-cog' />
            </span>
            <span className='vcv-ui-editor-panel-hide-control' title={closeTitleWithShortcut} onClick={this.handleClickCloseContent}>
              <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
            </span>
          </div>
        </div>
        <PanelNavigation controls={controls} activeSection={this.props.activeTab} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {content}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
