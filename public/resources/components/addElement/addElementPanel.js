import vcCake from 'vc-cake'
import React from 'react'
import {default as Categories} from './lib/categories'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class AddElementPanel extends React.Component {
  static propTypes = {
    parent: React.PropTypes.string,
    options: React.PropTypes.object
  }
  getElementList () {
    let parentContainerFor = ['General']
    let allElements = cook.list.settings()
    let parentId = false // this.props.api.actions.getParent()
    if (parentId) {
      let data = DocumentData.get(parentId)
      let parent = cook.get(data)
      parentContainerFor = parent.containerFor()
    }
    return allElements.filter((elementData) => {
      let element = cook.get(elementData)
      return element ? element.relatedTo(parentContainerFor) : false
    })
  }

  render () {
    let elements = this.getElementList()
    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-element-content'>
        <Categories elements={elements} options={this.props.options} />
      </div>
    )
  }
}
