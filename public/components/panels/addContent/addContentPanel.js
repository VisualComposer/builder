import React from 'react'
import AddElementPanel from '../addElement/addElementPanel'
import AddTemplatePanel from '../addTemplate/addTemplatePanel'
import PanelNavigation from '../panelNavigation'
import Scrollbar from '../../scrollbar/scrollbar'
import Search from './lib/search'

export default class AddContentPanel extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)

    this.state = {
      activeSection: this.props.activeTab,
      searchValue: ''
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  setActiveSection (type) {
    this.setState({
      activeSection: type
    })
  }

  handleSearch (value) {
    this.setState({ searchValue: value })
  }

  render () {
    const controls = {
      addElement: {
        index: 0,
        type: 'addElement',
        title: 'Elements',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentElements : 'Search content elements',
        content: <AddElementPanel options={this.props.options} searchValue={this.state.searchValue} />
      },
      addTemplate: {
        index: 1,
        type: 'addTemplate',
        title: 'Templates',
        searchPlaceholder: AddContentPanel.localizations ? AddContentPanel.localizations.searchContentTemplates : 'Search content templates',
        content: <AddTemplatePanel searchValue={this.state.searchValue} />
      }
    }

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content--full-width'>
        <Search onSearchChange={this.handleSearch} searchValue={this.state.searchValue} searchPlaceholder={controls[this.state.activeSection].searchPlaceholder} />
        <PanelNavigation controls={controls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {controls[this.state.activeSection].content}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
