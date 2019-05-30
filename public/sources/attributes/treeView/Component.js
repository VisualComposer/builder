import React from 'react'
import Attribute from '../attribute'
import TreeViewLayout from 'public/components/panels/treeView/treeViewLayout'

export default class TreeViewAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'treeView'
  }

  render () {
    const isVisible = true
    const isAttribute = true

    return (
      <div className='vcv-ui-form-tree-view--attribute'>
        <TreeViewLayout visible={isVisible} isAttribute={isAttribute} element={this.props.elementAccessPoint.cook()} />
      </div>
    )
  }
}
