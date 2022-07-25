import React from 'react'
import TreeViewElement from './treeViewElement'
import { connect } from 'react-redux'

const TreeViewElementWrapper = (props) => {
  return <TreeViewElement {...props} />
}

TreeViewElementWrapper.displayName = 'TreeViewElementWrapper'

const mapStateToProps = (state, props) => {
  return {
    isElementHovered: state.controls.outlineData.id === props.id,
    elementData: state.document.documentData[props.id]
  }
}

export default connect(mapStateToProps)(TreeViewElementWrapper)
