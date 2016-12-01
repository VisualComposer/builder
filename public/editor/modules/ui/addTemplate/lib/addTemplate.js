import React from 'react'
import classNames from 'classnames'
import SearchTemplate from './searchTemplate'
import TemplateTab from './templateTab'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
import SaveTemplate from './saveTemplate'
import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')
const wipAssetsManager = vcCake.getService('wipAssetsManager')

export default class addTemplate extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    tabs: React.PropTypes.array
  }

  static defaultProps = {
    tabs: [
      {
        title: 'My Templates',
        index: 0,
        id: 'MyTemplates'
      },
      {
        title: 'Hub Templates',
        index: 1,
        id: 'HubTemplates'
      },
      {
        title: 'Save Template',
        index: 2,
        id: 'SaveTemplate'
      }
    ]
  }

  constructor (props) {
    super(props)
    this.state = {
      activeTab: 0,
      tabTitle: 'My Templates',
      templateName: '',
      inputValue: '',
      isSearching: false,
      centered: false,
      templatesExist: false
    }
    this.changeActiveTab = this.changeActiveTab.bind(this)
    this.changeTabTitle = this.changeTabTitle.bind(this)
    this.changeTemplateName = this.changeTemplateName.bind(this)
    this.changeSearchInput = this.changeSearchInput.bind(this)
    this.changeSearchState = this.changeSearchState.bind(this)
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this)
    this.handleGoToSaveTemplate = this.handleGoToSaveTemplate.bind(this)
    this.handleGoToHub = this.handleGoToHub.bind(this)
  }

  // Check state

  isSearching () {
    let { isSearching, inputValue } = this.state
    return isSearching && inputValue.trim()
  }

  // Change state

  changeTemplateName (name) {
    this.setState({templateName: name})
  }

  changeActiveTab (index) {
    this.setState({activeTab: index})
  }

  changeTabTitle (title) {
    this.setState({tabTitle: title})
  }

  changeSearchState (state) {
    this.setState({isSearching: state})
  }

  changeSearchInput (value) {
    this.setState({inputValue: value})
  }

  // Get Props

  getSaveTemplateProps () {
    return {
      changeTemplateName: this.changeTemplateName
    }
  }

  getTabsProps (tab) {
    return {
      key: `vcv${tab.id}`,
      title: tab.title,
      active: this.state.activeTab,
      index: tab.index,
      changeActive: this.changeActiveTab,
      changeTabTitle: this.changeTabTitle,
      changeActiveSave: this.changeActiveSave
    }
  }

  getSearchProps () {
    return {
      changeSearchState: this.changeSearchState,
      changeSearchInput: this.changeSearchInput
    }
  }

  // Get HTML Elements

  getSearch () {
    return <SearchTemplate {...this.getSearchProps()} />
  }

  getTabs () {
    return this.props.tabs.map((tab) => {
      return <TemplateTab {...this.getTabsProps(tab)} />
    })
  }

  getNoResultsElement (tab) {
    let source
    let btnText = 'No Results. Open Visual Composer Hub'
    let helper = `Didn't find the right template? Check out Visual Composer Hub for more layout templates.`
    let button = <button className='vcv-ui-editor-no-items-action'>{btnText}</button>
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      source = wipAssetsManager.getSourcePath('images/search-no-result.png')
    } else {
      source = assetsManager.getSourcePath('images/search-no-result.png')
    }
    if (!this.state.templatesExist) {
      switch (tab) {
        case 'MyTemplates':
          btnText = 'Save Your First Template'
          helper = `You don't have any templates yet. Try to save your current layout as a template.`
          button = <button className='vcv-ui-editor-no-items-action' onClick={this.handleGoToSaveTemplate}>{btnText}</button>
          break
        case 'HubTemplates':
          btnText = 'Open Visual Composer Hub'
          helper = 'Add templates from Visual Composer Element Hub for free.'
          button = <button className='vcv-ui-editor-no-items-action' onClick={this.handleGoToHub}>{btnText}</button>
          break
      }
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        source = wipAssetsManager.getSourcePath('images/add-item.png')
      } else {
        source = assetsManager.getSourcePath('images/add-item.png')
      }
    }
    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt='Nothing Found'
        />
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        {button}
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        <p className='vcv-ui-form-helper'>{helper}</p>
      </div>
    </div>
  }

  getSearchResults () {
    return []
  }

  getTemplateList () {
    return []
  }

  getTemplateListContainer (itemsOutput, tab) {
    return itemsOutput.length ? <div className='vcv-ui-item-list-container'>
      <ul className='vcv-ui-item-list'>
        {itemsOutput}
      </ul>
    </div> : this.getNoResultsElement(tab)
  }

  getSaveTemplate () {
    return <SaveTemplate {...this.getSaveTemplateProps()} />
  }

  // Event handlers

  handleSaveTemplate (e) {
    e && e.preventDefault()
    console.log('Template name: ', this.state.templateName)
    let myTemplates = this.props.tabs.findIndex((tab) => {
      return tab.id === 'MyTemplates'
    })
    this.changeActiveTab(myTemplates)
  }

  handleGoToSaveTemplate () {
    let saveIndex = this.props.tabs.findIndex((tab) => {
      return tab.id === 'SaveTemplate'
    })
    this.changeActiveTab(saveIndex)
    this.changeTabTitle('Save Template')
  }

  handleGoToHub () {
    console.log('link to hub...')
  }

  render () {
    let output, itemsOutput
    switch (this.props.tabs[this.state.activeTab].id) {
      case 'MyTemplates':
      case 'HubTemplates':
        itemsOutput = this.isSearching() ? this.getSearchResults() : this.getTemplateList()
        output = this.getTemplateListContainer(itemsOutput, this.props.tabs[this.state.activeTab].id)
        break
      case 'SaveTemplate':
        output = this.getSaveTemplate()
        break
    }

    let footerClasses = classNames({
      'vcv-ui-tree-content-footer': true,
      'vcv-ui-state--hidden': this.state.tabTitle !== 'Save Template'
    })
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': itemsOutput && !itemsOutput.length
    })

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-template-content'>
        <div className='vcv-ui-tree-content'>
          {this.getSearch()}
          <div className='vcv-ui-editor-tabs-container'>
            <nav className='vcv-ui-editor-tabs'>
              {this.getTabs()}
            </nav>
          </div>
          <div className='vcv-ui-tree-content-section'>
            <Scrollbar>
              <div className={innerSectionClasses}>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                      {output}
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
          <div className={footerClasses}>
            <div className='vcv-ui-tree-layout-actions'>
              <a
                className='vcv-ui-tree-layout-action'
                href='#'
                title='Save'
                onClick={this.handleSaveTemplate}
              >
                <span className='vcv-ui-tree-layout-action-content'>
                  <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-save' />
                  <span>Save</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
