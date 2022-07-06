import React, { memo } from 'react'
import lodash from 'lodash'
import TreeViewElement from './treeViewElement'

interface Props {
  element: object
  children?: React.ReactNode
}

function areEqual (prevProps: Readonly<Props>, nextProps: Readonly<Props>) {
  if (lodash.isEqual(prevProps.element, nextProps.element)) {
    return true
  }
  return false
}

const TreeViewElementWrapper = (props: Props) => {
  return (
    <TreeViewElement
      {...props}
    >
      {props.children}
    </TreeViewElement>
  )
}

TreeViewElementWrapper.displayName = 'TreeViewElementWrapper'

export default memo(TreeViewElementWrapper, areEqual)
