import React, { forwardRef, memo } from 'react'
import { connect } from 'react-redux'
import { rowHoverIdChanged } from '../../../stores/controls/slice'

const ElementContainerWrapper = forwardRef((props, ref) => {
  const handleMouseOver = (event) => {
    event.stopPropagation()
    props.rowHoverIdChanged(props.id)
  }

  const handleMouseLeave = (event) => {
    event.stopPropagation()
    props.rowHoverIdChanged(null)
  }

  const customEditorProps = { ...props.editor }

  const hoverData = props.columnResizeData
  const isColResizerHovered = hoverData?.mode === 'columnResizerHover' && hoverData?.id === props.id
  const isColDragging = props.columnResizerDraggingId === props.id
  const isResizerVisible = props.rowHoverId === props.id

  if (isResizerVisible || isColDragging) {
    customEditorProps['data-vcv-resizer-visible'] = true
  }

  if (isColResizerHovered || isColDragging) {
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

ElementContainerWrapper.displayName = 'ElementContainerWrapper'

const mapStateToProps = (state) => ({
  columnResizeData: state.controls.columnResizeData,
  columnResizerDraggingId: state.controls.columnResizerDraggingId,
  rowHoverId: state.controls.rowHoverId
})

const mapDispatchToProps = (dispatch) => ({
  rowHoverIdChanged: (data) => dispatch(rowHoverIdChanged(data))
})

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(memo(ElementContainerWrapper))
