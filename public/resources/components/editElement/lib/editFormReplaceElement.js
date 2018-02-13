import React from 'react'
import classNames from 'classnames'
import ReplaceElement from './ReplaceElement'
import vcCake from 'vc-cake'

const hubCategoriesService = vcCake.getService('hubCategories')
const elementsStorage = vcCake.getStorage('elements')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')

export default class EditFormReplaceElement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: true,
      sectionDependenciesClasses: []
    }
    this.toggleSection = this.toggleSection.bind(this)
    this.handleReplaceElement = this.handleReplaceElement.bind(this)
    this.openEditFormOnReplace = this.openEditFormOnReplace.bind(this)
  }

  toggleSection () {
    this.setState({ isActive: !this.state.isActive })
  }

  handleReplaceElement (tag) {
    const id = this.previousElementId = this.props.element.get('id')
    let editFormTabSettings = this.props.element.settings('editFormTab1')
    let currentElementAttributes = [
      ...(editFormTabSettings && editFormTabSettings.settings && editFormTabSettings.settings.value),
      'parent'
    ]
    let replaceElementMergeData = {
      tag
    }
    currentElementAttributes.forEach(key => {
      replaceElementMergeData[ key ] = this.props.element.get(key)
    })
    elementsStorage.state('elementReplace').onChange(this.openEditFormOnReplace)
    elementsStorage.trigger('replace', id, replaceElementMergeData)
  }

  openEditFormOnReplace ({ id, data }) {
    if (id === this.previousElementId) {
      elementsStorage.state('elementReplace').ignoreChange(this.openEditFormOnReplace)
      if (vcCake.env('NAVBAR_SINGLE_CONTENT')) {
        workspaceContentState.set(false)
      }
      let settings = workspaceStorage.state('settings').get()
      if (settings && settings.action === 'edit') {
        workspaceStorage.state('settings').set(false)
      }
      workspaceStorage.trigger('edit', data.id, data.tag, { insertAfter: false })
    }
  }

  render () {
    let { element } = this.props
    let { isActive, sectionDependenciesClasses } = this.state
    let tag = element.get('tag')
    let sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive
    }, sectionDependenciesClasses)
    let tabTitle = 'Replace Element'
    let category = hubCategoriesService.getElementCategoryName(tag) || ''
    let options = {
      category: category || '*',
      elementLabel: element.getName() || category.toLowerCase() || 'element'
    }

    let categorySettings = hubCategoriesService.get(category)
    if (!categorySettings || !categorySettings.elements || categorySettings.elements.length <= 1 || element.relatedTo('RootElements') || !element.relatedTo('General')) {
      return null
    }

    return (
      <div className={sectionClasses}>
        <div className='vcv-ui-edit-form-section-header' onClick={this.toggleSection}>
          {tabTitle}
        </div>
        <form className='vcv-ui-edit-form-section-content'>
          <div className='vcv-ui-form-group' key={`form-group-field-${element.get('id')}-replaceElement`}>
            <ReplaceElement
              options={options}
              tag={tag}
              updater={this.handleReplaceElement}
              element={element}
            />
          </div>
        </form>
      </div>
    )
  }
}
