import React from 'react'
import classNames from 'classnames'
import SearchTemplate from './searchTemplate'
import TemplateTab from './templateTab'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
import SaveTemplate from './saveTemplate'
import TemplateControl from './templateControl'
import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')
const wipAssetsManager = vcCake.getService('wipAssetsManager')
const templateManager = vcCake.getService('myTemplates')

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
      templatesExist: false,
      error: false,
      errorName: ''
    }
    this.changeActiveTab = this.changeActiveTab.bind(this)
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
    this.setState({
      templateName: name,
      error: false
    })
  }

  changeActiveTab (index, title) {
    this.setState({
      activeTab: index,
      tabTitle: title,
      isSearching: false,
      inputValue: '',
      templatesExist: title === 'My Templates' && templateManager.all().length // TODO get template list in condition depending on the active tab
    })
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
      changeActive: this.changeActiveTab
    }
  }

  getSearchProps () {
    return {
      inputValue: this.state.inputValue,
      changeSearchState: this.changeSearchState,
      changeSearchInput: this.changeSearchInput
    }
  }

  getTemplateControlProps (template) {
    return {
      api: this.props.api,
      key: 'vcv-element-control-' + template.id,
      data: template.data,
      id: template.id,
      name: template.name
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
    let source, btnText, helper, button
    if (!this.state.templatesExist && !this.state.isSearching) {
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
    } else {
      btnText = 'No Results. Open Visual Composer Hub'
      helper = `Didn't find the right template? Check out Visual Composer Hub for more layout templates.`
      button = <button className='vcv-ui-editor-no-items-action'>{btnText}</button>
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        source = wipAssetsManager.getSourcePath('images/search-no-result.png')
      } else {
        source = assetsManager.getSourcePath('images/search-no-result.png')
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

  getTemplateControl (template) {
    return <TemplateControl {...this.getTemplateControlProps(template)} />
  }

  getSearchResults (tab) {
    let { inputValue } = this.state
    let templateList
    switch (tab) {
      case 'MyTemplates':
        templateList = templateManager.all()
        break
      case 'HubTemplates':
        templateList = []
        break
    }
    return templateList.filter((val) => {
      let name = val.name.toLowerCase()
      return val.hasOwnProperty('name') && name.indexOf(inputValue.toLowerCase().trim()) !== -1
    }).map((template) => {
      return this.getTemplateControl(template)
    })
  }

  getTemplateList (tab) {
    switch (tab) {
      case 'MyTemplates':
        return templateManager.all().map((template) => {
          return this.getTemplateControl(template)
        })
      case 'HubTemplates':
        return []
    }
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
    if (this.state.templateName.trim()) {
      let templateExists = templateManager.all().findIndex((template) => {
        return template.name === this.state.templateName.trim()
      })
      if (templateExists < 0) {
        templateManager.addCurrentLayout(this.state.templateName)
        let myTemplates = this.props.tabs.findIndex((tab) => {
          return tab.id === 'MyTemplates'
        })
        this.changeActiveTab(myTemplates)
        this.setState({templateName: ''})
      } else {
        this.setState({
          error: true,
          errorName: 'Template with this title already exist. Please specify another title.'
        })
      }
    } else {
      this.setState({
        error: true,
        errorName: 'Please specify template title.'
      })
    }
  }

  handleGoToSaveTemplate () {
    let saveIndex = this.props.tabs.findIndex((tab) => {
      return tab.id === 'SaveTemplate'
    })
    this.changeActiveTab(saveIndex, 'Save Template')
  }

  handleGoToHub () {
    console.log('link to hub...')
  }

  render () {
    let output, itemsOutput
    let activeTabId = this.props.tabs[this.state.activeTab].id
    // TODO refactor switch after interaction with HUB is complete
    switch (activeTabId) {
      case 'MyTemplates':
        itemsOutput = this.isSearching(activeTabId) ? this.getSearchResults(activeTabId) : this.getTemplateList(activeTabId)
        output = this.getTemplateListContainer(itemsOutput, activeTabId)
        break
      case 'HubTemplates':
        itemsOutput = this.getTemplateList(activeTabId)
        output = this.getTemplateListContainer(itemsOutput, activeTabId)
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
    let errorMessageClasses = classNames({
      'vcv-ui-tree-content-error-message': true,
      'vcv-ui-tree-content-error-message--visible': this.state.error
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
            <div className='vcv-ui-tree-content-error-message-container'>
              <div className={errorMessageClasses}>{this.state.errorName}</div>
            </div>
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
