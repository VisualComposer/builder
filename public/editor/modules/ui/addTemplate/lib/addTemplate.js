import React from 'react'
import classNames from 'classnames'
import SearchTemplate from './searchTemplate'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
import TemplateControl from './templateControl'
import vcCake from 'vc-cake'

const assetsManager = vcCake.getService('assets-manager')
const wipAssetsManager = vcCake.getService('wipAssetsManager')
const templateManager = vcCake.getService('myTemplates')
const documentManager = vcCake.getService('document')

export default class AddTemplate extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array
  }

  static defaultProps = {
    categories: [
      {
        title: 'All',
        index: 0,
        id: 'all',
        visible () { return true },
        templates () { return templateManager.all() } // TODO: Merge from all categories
      },
      {
        title: 'My Templates',
        index: 1,
        id: 'myTemplates',
        visible () { return this.templates().length },
        templates () { return templateManager.all() }
      },
      {
        title: 'Hub Templates',
        index: 2,
        id: 'hubTemplates',
        visible () { return this.templates().length },
        templates () { return [] } // TODO: get templates from HUB
      },
      {
        title: 'Download More Templates',
        index: 3,
        id: 'downloadMoreTemplates',
        visible () { return true },
        templates: null
      }
    ]
  }
  errorTimeout = 0

  constructor (props) {
    super(props)
    this.state = {
      activeCategoryIndex: 0,
      categoryTitle: 'My Templates',
      templateName: '',
      inputValue: '',
      isSearching: false,
      error: false,
      errorName: '',
      showSpinner: false
    }
    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeTemplateName = this.changeTemplateName.bind(this)
    this.changeSearchInput = this.changeSearchInput.bind(this)
    this.changeSearchState = this.changeSearchState.bind(this)
    this.displayError = this.displayError.bind(this)
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this)
    this.handleGoToHub = this.handleGoToHub.bind(this)
    this.handleApplyTemplate = this.handleApplyTemplate.bind(this)
    this.handleRemoveTemplate = this.handleRemoveTemplate.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onSaveFailed = this.onSaveFailed.bind(this)
    this.onRemoveSuccess = this.onRemoveSuccess.bind(this)
    this.onRemoveFailed = this.onRemoveFailed.bind(this)
  }

  componentWillUnmount () {
    if (this.errorTimeout) {
      window.clearTimeout(this.errorTimeout)
      this.errorTimeout = 0
    }
  }

  // Check state

  isSearching () {
    return this.state.isSearching && this.state.inputValue.trim()
  }

  // Change state

  changeTemplateName (e) {
    this.setState({
      templateName: e.currentTarget.value,
      error: false
    })
  }

  changeActiveCategory (index) {
    this.setState({
      activeCategoryIndex: index,
      categoryTitle: this.props.categories[ index ].title
    })
  }

  changeSearchState (state) {
    this.setState({ isSearching: state })
  }

  changeSearchInput (value) {
    this.setState({ inputValue: value })
  }

  displayError (error, state) {
    state = Object.assign({}, state, {
      error: true,
      errorName: error,
      showSpinner: false
    })
    this.setState(state)
    this.errorTimeout = setTimeout(() => {
      this.setState({
        error: false
      })
    }, 2300)
  }

  // Get Props

  getSearchProps () {
    return {
      inputValue: this.state.inputValue,
      changeSearchState: this.changeSearchState,
      changeSearchInput: this.changeSearchInput,
      index: this.state.activeCategoryIndex,
      allCategories: this.props.categories,
      changeActiveCategory: this.changeActiveCategory
    }
  }

  getTemplateControlProps (template) {
    return {
      api: this.props.api,
      key: 'vcv-element-control-' + template.id,
      applyTemplate: this.handleApplyTemplate,
      removeTemplate: this.handleRemoveTemplate,
      ...template
    }
  }

  // Get HTML elements

  getSearch () {
    return <SearchTemplate {...this.getSearchProps()} />
  }

  getNoResultsElement () {
    let source, btnText, helper, button
    if (!this.props.categories[ 0 ].templates().length && !this.state.isSearching) {
      btnText = 'Download More Templates'
      helper = `You don't have any templates yet. Try to save your current layout as a template or download templates from Visual Composer Hub.`
      button = <button className='vcv-ui-editor-no-items-action' onClick={this.handleGoToHub}>{btnText}</button>
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        source = wipAssetsManager.getSourcePath('images/add-item.png')
      } else {
        source = assetsManager.getSourcePath('images/add-item.png')
      }
    } else {
      btnText = 'Download More Templates'
      helper = `Didn't find the right template? Check out Visual Composer Hub for more layout templates.`
      button = <button className='vcv-ui-editor-no-items-action' onClick={this.handleGoToHub}>{btnText}</button>
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
        <p className='vcv-ui-form-helper'>{helper}</p>
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        {button}
      </div>
    </div>
  }

  getTemplateControl (template) {
    return <TemplateControl {...this.getTemplateControlProps(template)} />
  }

  getSearchResults () {
    let { inputValue } = this.state
    return this.props.categories[ 0 ].templates().filter((template) => {
      let name = template.name.toLowerCase()
      return template.hasOwnProperty('name') && name.indexOf(inputValue.toLowerCase().trim()) !== -1
    }).map((template) => {
      return this.getTemplateControl(template)
    })
  }

  getTemplatesByCategory () {
    let { activeCategoryIndex } = this.state

    if (this.props.categories[ activeCategoryIndex ].id === 'downloadMoreTemplates') {
      this.handleGoToHub()
      return []
    }
    let templates = this.props.categories[ activeCategoryIndex ].templates()
    return templates.map((template) => {
      return this.getTemplateControl(template)
    })
  }

  getTemplateListContainer (itemsOutput) {
    return itemsOutput.length ? <div className='vcv-ui-item-list-container'>
      <ul className='vcv-ui-item-list'>
        {itemsOutput}
      </ul>
    </div> : this.getNoResultsElement()
  }

  // Event handlers

  handleSaveTemplate (e) {
    e && e.preventDefault()
    let { templateName } = this.state
    templateName = templateName.trim()
    if (templateName) {
      if (templateManager.findBy('name', templateName)) {
        this.displayError('Template with this name already exist. Please specify another name.')
      } else if (!documentManager.size()) {
        this.displayError('Template content is empty.')
      } else {
        this.setState({ showSpinner: templateName })
        let templateAddResult = templateManager.addCurrentLayout(templateName, this.onSaveSuccess, this.onSaveFailed)
        if (templateAddResult) {
          this.props.api.request('templates:save', templateName)
        } else {
          this.displayError('Template save failed.')
        }
      }
    } else {
      this.displayError('Please specify template name.')
    }
  }

  onSaveSuccess (id) {
    this.props.api.request('templates:save', id)
    this.setState({
      templateName: '',
      activeCategoryIndex: 1,
      categoryTitle: this.props.categories[ 1 ].title,
      isSearching: false,
      inputValue: '',
      showSpinner: false
    })
  }

  onSaveFailed () {
    this.displayError('Template save failed.')
  }

  handleGoToHub () {
    console.log('link to hub...')
  }

  handleApplyTemplate (data) {
    this.props.api.request('data:merge', data)
  }

  handleRemoveTemplate (id) {
    if (window.confirm('Do you want to remove this template?')) {
      templateManager.remove(id, this.onRemoveSuccess, this.onRemoveFailed)
    }
  }

  onRemoveSuccess (id) {
    this.props.api.request('templates:remove', id)

    if (!this.props.categories[ this.state.activeCategoryIndex ].templates().length) {
      this.setState({ activeCategoryIndex: 0 })
    } else {
      this.setState({ activeCategoryIndex: this.state.activeCategoryIndex })
    }
  }

  onRemoveFailed () {
    this.displayError('Template remove failed.')
  }

  render () {
    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getTemplatesByCategory()

    if (this.state.showSpinner) {
      itemsOutput.unshift(this.getTemplateControl({
        name: this.state.showSpinner,
        data: {},
        spinner: true
      }))
    }

    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': itemsOutput && !itemsOutput.length
    })
    let errorMessageClasses = classNames({
      'vcv-ui-tree-content-error-message': true,
      'vcv-ui-tree-content-error-message--visible': this.state.error
    })
    let listCtaClasses = classNames({
      'vcv-ui-editor-list-cta-wrapper': true,
      'vcv-ui-state--hidden': itemsOutput && !itemsOutput.length
    })

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-template-content'>
        <div className='vcv-ui-tree-content'>
          {this.getSearch()}
          <div className='vcv-ui-tree-content-section'>
            <div className='vcv-ui-tree-content-error-message-container'>
              <div className={errorMessageClasses}>{this.state.errorName}</div>
            </div>
            <Scrollbar>
              <div className={innerSectionClasses}>
                <div className='vcv-ui-form-dependency'>
                  <div className='vcv-ui-form-group'>
                    <span className='vcv-ui-form-group-heading'>Template name</span>
                    <form
                      className='vcv-ui-save-template-form'
                      onSubmit={this.handleSaveTemplate}
                      disabled={this.state.showSpinner}
                    >
                      <input
                        className='vcv-ui-form-input'
                        type='text'
                        value={this.state.templateName}
                        onChange={this.changeTemplateName}
                        disabled={this.state.showSpinner}
                      />
                      <button
                        className='vcv-ui-save-template-submit vcv-ui-editor-no-items-action'
                        type='submit'
                        disabled={this.state.showSpinner}
                      >Save Template
                      </button>
                    </form>
                  </div>
                </div>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                      {this.getTemplateListContainer(itemsOutput)}
                    </div>
                  </div>
                </div>
                <div className={listCtaClasses}>
                  <button
                    className='vcv-ui-editor-no-items-action'
                    onClick={this.handleGoToHub}
                  >Download More Templates
                  </button>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      </div>
    )
  }
}
