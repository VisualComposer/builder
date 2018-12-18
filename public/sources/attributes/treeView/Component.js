import React from 'react'
import Attribute from '../attribute'
import TreeViewLayout from 'public/components/panels/treeView/treeViewLayout'

export default class TreeViewAttribute extends Attribute {
  render () {
    const isVisible = true
    const isAttribute = true

    return (
      <div className='vcv-ui-form-tree-view--attribute'>
        <TreeViewLayout visible={isVisible} isAttribute={isAttribute} element={this.props.element} />
      </div>
    )
  }
}
