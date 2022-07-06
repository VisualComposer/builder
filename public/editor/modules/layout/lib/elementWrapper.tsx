import React, { forwardRef, memo } from 'react'
import lodash from 'lodash'

interface Props {
  rawAtts: object
  children?: React.ReactNode
  contentComponent: React.ReactElement
  editor: object
  element: {
    tag: string
  }
}

function areEqual (prevProps: Readonly<Props>, nextProps: Readonly<Props>) {
  if (lodash.isEqual(prevProps.rawAtts, nextProps.rawAtts)) {
    return true
  }

  return false
}

const ElementWrapper = forwardRef((props: Props, ref) => {
  const customEditorProps = { ...props.editor }
  const ContentComponent = props.contentComponent
  return (
    // @ts-ignore
    <ContentComponent
      {...props}
      editor={customEditorProps}
      ref={ref}
    >
      {props.children}
    </ContentComponent>
  )
})

ElementWrapper.displayName = 'ElementInnerSimple'

export default memo(ElementWrapper, areEqual)
