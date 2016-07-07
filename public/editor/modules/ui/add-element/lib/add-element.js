/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
import React from 'react'
import {default as Categories} from './categories'
const cook = vcCake.getService('cook')
const documentManager = vcCake.getService('document')

class AddElement extends React.Component {
  getElementList () {
    let allElements = cook.list.settings()
    let parentId = this.props.api.actions.getParent()
    if (parentId) {
      let data = documentManager.get(parentId)
      let parent = cook.get(data)
      return allElements.filter((elementData) => {
        let element = cook.get(elementData)
        return element.relatedTo(parent.containerFor())
      })
    }
    return allElements
  }
  render () {
    var elements = this.getElementList()
    let content = <Categories elements={elements} api={this.props.api} />

    return (
      <div className="vcv-ui-tree-view-content vcv-ui-add-element-content">
        {content}
      </div>
    )
  }
}
AddElement.propTypes = {
  api: React.PropTypes.object.isRequired,
  parent: React.PropTypes.string
}

module.exports = AddElement

