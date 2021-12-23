import React from 'react'
import ReplaceElement from './ReplaceElement'
import vcCake from 'vc-cake'
import { isEqual } from 'lodash'

const hubElementsService = vcCake.getService('hubElements')
const cook = vcCake.getService('cook')
const elementsStorage = vcCake.getStorage('elements')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')

export default class EditFormReplaceElement extends React.Component {
  constructor (props) {
    super(props)
    this.replaceElementRef = React.createRef()
    this.handleReplaceElement = this.handleReplaceElement.bind(this)
    this.openEditFormOnReplace = this.openEditFormOnReplace.bind(this)
  }

  handleReplaceElement (tag, presetCookElement) {
    const currentCookElement = this.props.elementAccessPoint.cook()
    const cookElement = presetCookElement || currentCookElement
    const id = this.previousElementId = currentCookElement.get('id')
    const editFormTabSettings = cookElement.filter((key, value, settings) => {
      return settings.access === 'public' && settings.type !== 'group' && settings.type !== 'element'
    })
    const currentElementAttributes = [
      ...editFormTabSettings,
      'parent'
    ]
    const replaceElementMergeData = {
      tag
    }
    const category = hubElementsService.getElementCategoryName(tag)
    currentElementAttributes.forEach(key => {
      let value = cookElement.get(key)
      if (key === 'image' && category === 'Image gallery') {
        const initialValue = cookElement.settings(key).settings.value
        const currentValue = cookElement.get(key)
        const isValuesEqual = isEqual(initialValue, currentValue)
        if (isValuesEqual) {
          value = cook.get({ tag }).get(key)
          replaceElementMergeData[key] = value
        }
      }
      replaceElementMergeData[key] = value
    })
    if (presetCookElement) {
      replaceElementMergeData.parent = currentCookElement.get('parent')
    }
    elementsStorage.state('elementReplace').onChange(this.openEditFormOnReplace)
    elementsStorage.trigger('replace', id, replaceElementMergeData)
  }

  openEditFormOnReplace ({ id, data }) {
    if (id === this.previousElementId) {
      elementsStorage.state('elementReplace').ignoreChange(this.openEditFormOnReplace)
      workspaceContentState.set(false)
      const settings = workspaceStorage.state('settings').get()
      if (settings && settings.action === 'edit') {
        workspaceStorage.state('settings').set(false)
      }
      const options = { insertAfter: false, isReplaceOpened: true }
      const scrollElement = this.replaceElementRef && this.replaceElementRef.current && this.replaceElementRef.current.closest('.vcv-ui-scroll-content')
      const scrollTop = scrollElement && scrollElement.scrollTop
      if (scrollTop) {
        options.replaceElementScrollTop = scrollTop
      }
      workspaceStorage.trigger('edit', data.id, data.activeTab, options)
    }
  }

  render () {
    const { elementAccessPoint } = this.props
    const cookElement = elementAccessPoint.cook()
    const tag = cookElement.get('tag')
    const category = cookElement.get('metaReplaceCategory') || hubElementsService.getElementCategoryName(tag)

    const options = {
      category: category || '*',
      elementLabel: cookElement.get('name') || category.toLowerCase() || 'element'
    }

    return (
      <div className='vcv-ui-form-group' key={`form-group-field-${cookElement.get('id')}-replaceElement`} ref={this.replaceElementRef}>
        <ReplaceElement
          options={options}
          tag={tag}
          onReplace={this.handleReplaceElement}
          element={cookElement}
        />
      </div>
    )
  }
}
