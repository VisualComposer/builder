import React from 'react'
import AddElementPanel from '../addElement/addElementPanel'
import AddTemplatePanel from '../addTemplate/addTemplatePanel'
import PanelNavigation from '../panelNavigation'
import Scrollbar from '../../scrollbar/scrollbar'
import Search from './lib/search'
import vcCake from 'vc-cake'
const dataManager = vcCake.getService('dataManager')
const workspaceStorage = vcCake.getStorage('workspace')

export default class AddContentPanel extends React.Component {
  static localizations = dataManager.get('localizations')

  iframe = document.getElementById('vcv-editor-iframe') && document.getElementById('vcv-editor-iframe').contentWindow.document

  constructor (props) {
    super(props)

    this.state = {
      searchValue: ''
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.setFirstElement = this.setFirstElement.bind(this)
    this.scrollToElementInsideFrame = this.scrollToElementInsideFrame.bind(this)
  }

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

  render () {
    const controls = {
      addElement: {
        index: 0,
        type: 'addElement',
        title: AddContentPanel.localizations ? AddContentPanel.localizations.elements : 'Elements',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentElements : 'Search for content elements',
        content: <AddElementPanel options={this.props.options} searchValue={this.state.searchValue} applyFirstElement={this.state.applyFirstElement} handleScrollToElement={this.scrollToElementInsideFrame} />
      },
      addTemplate: {
        index: 1,
        type: 'addTemplate',
        title: AddContentPanel.localizations ? AddContentPanel.localizations.templates : 'Templates',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentTemplates : 'Search templates',
        content: <AddTemplatePanel searchValue={this.state.searchValue} handleScrollToElement={this.scrollToElementInsideFrame} />
      }
    }

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content--full-width'>
        <Search
          onSearchChange={this.handleSearch}
          searchValue={this.state.searchValue}
          searchPlaceholder={controls[this.props.activeTab].searchPlaceholder}
          setFirstElement={this.setFirstElement}
        />
        <PanelNavigation controls={controls} activeSection={this.props.activeTab} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {controls[this.props.activeTab].content}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
