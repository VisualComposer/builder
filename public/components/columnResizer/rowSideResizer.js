import React from 'react'
import vcCake from 'vc-cake'

const RowSideResizer = (props) => {
  const documentService = vcCake.getService('document')
  const [dragging, setDragging] = React.useState(false)
  const [left, setLeft] = React.useState('auto')
  const [right, setRight] = React.useState('auto')
  const self = React.useRef(null)

  const handleMouseMove = (e) => {
    if (dragging) {
      const container = self.current.closest('.vce-row-container')
      const rowId = container.firstChild.dataset.vcvDndElement
      const rowService = documentService.get(rowId)
      const bounding = container.getBoundingClientRect()
      const row = self.current.closest('.vce-row')
      const value = props.left ? handleLeftBar(e, bounding, row) : handleRightBar(e, bounding, row)
      rowService.designOptionsAdvanced.attributeMixins['boxModelMixin:all'].variables.marginLeft.value = value
      rowService.designOptionsAdvanced.device.all.boxModel.marginLeft = value
      documentService.update(rowId, rowService)
    }
  }

  const handleLeftBar = (e, bounding, row) => {
    const distance = e.pageX - bounding.x
    const marginLeft = distance > 0 ? `${Math.round(distance)}px` : 'auto'
    row.style.marginLeft = marginLeft
    setLeft(marginLeft)
  }

  const handleRightBar = (e, bounding, row) => {
    const distance = bounding.x + bounding.width - e.pageX
    const marginRight = distance > 0 ? `${Math.round(distance)}px` : 'auto'
    row.style.marginRight = marginRight
    setRight(marginRight)
  }

  const addColumn = () => {
    console.log('addColumn')
  }

  return (
    <div
      ref={self}
      onMouseEnter={() => setDragging(false)}
      onMouseLeave={() => setDragging(true)}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      className={`vce-row-resizer-handler vce-row-resizer-position-${props.left ? 'left' : 'right'}`}
    >
      <div>
        <span onClick={addColumn}>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
        </span>
        <i className='seperator' />
        <span>{props.left ? left : right}</span>
      </div>
    </div>
  )
}

export default RowSideResizer
