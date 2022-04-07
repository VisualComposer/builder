import React, { forwardRef, useState } from 'react'
import { connect } from 'react-redux'

const ElementInner = forwardRef((props, ref) => {
  const [isResizerVisible, setResizerVisible] = useState(false)

  const handleMouseOver = (event) => {
    event.stopPropagation()
    setResizerVisible(true)
  }

  const handleMouseLeave = (event) => {
    event.stopPropagation()
    setResizerVisible(false)
  }

  const customEditorProps = { ...props.editor }

  const hoverData = props.columnResizeData
  const isColResizerHovered = hoverData?.mode === 'columnResizerHover' && hoverData?.id === props.id

  if (isResizerVisible) {
    customEditorProps['data-vcv-resizer-visible'] = true
  }

  if (isColResizerHovered) {
    customEditorProps['data-vcv-resizer-hovered'] = true
  }

  customEditorProps.onMouseOver = handleMouseOver
  customEditorProps.onMouseLeave = handleMouseLeave

  const ContentComponent = props.contentComponent
  return (
    <ContentComponent
      {...props}
      editor={customEditorProps}
      ref={ref}
    >
      {props.children}
    </ContentComponent>
  )
})

ElementInner.displayName = 'ElementInner'

const mapStateToProps = (state) => ({
  columnResizeData: state.controls.columnResizeData
})

export default connect(mapStateToProps, null, null, { forwardRef: true })(ElementInner)
