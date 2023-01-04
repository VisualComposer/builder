import React from 'react'
import Attribute from '../attribute'
import TreeViewLayout from 'public/components/panels/treeView/treeViewLayout'
import PropTypes from 'prop-types'

export default class TreeViewAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'treeView',
    options: PropTypes.any
  }

  render () {
    const isVisible = true
    const isAttribute = true

    return (
      <div className='vcv-ui-form-tree-view--attribute'>
        <TreeViewLayout visible={isVisible} isAttribute={isAttribute} isEditOnly={this.props.options.editOnly} element={this.props.elementAccessPoint.cook()} />
      </div>
    )
  }
}
