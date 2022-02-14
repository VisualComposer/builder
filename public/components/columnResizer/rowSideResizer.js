import { getStorage, getService } from 'vc-cake'
import React from 'react'

const RowSideResizer = (props) => {
  const workspaceStorage = getStorage('workspace')
  const elementsStorage = getStorage('elements')
  const documentService = getService('document')
  const layoutStorage = getStorage('layout')

  const [container, setContainer] = React.useState(undefined)
  const [dragging, setDragging] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [right, setRight] = React.useState('auto')
  const [left, setLeft] = React.useState('auto')
  const self = React.useRef(null)

  React.useEffect(() => setContainer(() => self.current.closest('.vce-row-container')), [])

  const handleMouseMove = (e) => {
    if (dragging) {
      const bounding = container.getBoundingClientRect()
      const row = self.current.closest('.vce-row')
      props.left ? handleLeftBar(e, bounding, row) : handleRightBar(e, bounding, row)
    }
  }

  const handleLeftBar = (e, bounding, row) => {
    const distance = e.pageX - bounding.x
    const margin = /*distance > 0 ?*/ `${Math.round(distance)}px` /* : 'auto'*/
    row.style.marginLeft = margin
    setLeft(margin)
    return margin
  }

  const handleRightBar = (e, bounding, row) => {
    const distance = bounding.x + bounding.width - e.pageX
    const margin = /*distance > 0 ?*/ `${Math.round(distance)}px` /*: 'auto'*/
    row.style.marginRight = margin
    setRight(margin)
    return margin
  }

  const addColumn = () => {
    if (!dragging) {
      const rowId = container.firstChild.dataset.vcvDndElement
      if (props.left) {
        const row = self.current.closest('.vce-row-content')
        const columns = row.getElementsByClassName('vce-col')
        const firstColId = columns[0].dataset.vcvElement

        workspaceStorage.trigger('add', rowId, 'column')

        setTimeout(() => {
          const newColId = columns[columns.length - 1].dataset.vcvElement
          workspaceStorage.trigger('move', newColId, { action: 'before', related: firstColId })
        }, 1);
      } else {
        workspaceStorage.trigger('add', rowId, 'column')
      }
    }
  }

  const handleMouseEnter = () => {
    setDragging(false)
    setExpanded(true)
  }

  const handleMouseLeave = () => {
    setDragging(true)
    setExpanded(false)
  }

  const handleMouseUp = () => {
    // const row = self.current.closest('.vce-row')
    // row.style.marginLeft = null
    // row.style.marginRight = null

    setDragging(false)
    const id = container.firstChild.dataset.vcvDndElement
    const element = documentService.get(id)
    if (element.designOptionsAdvanced.device) {
      const boxModel = element.designOptionsAdvanced.device.all.boxModel
      boxModel.combined = false
      boxModel[props.left ? 'marginLeft' : 'marginRight'] = props.left ? left : right
      // elementsStorage.trigger('update', id, element, '', { changedAttributeType: 'designOption' })
    }
  }

  return (
    <div
      ref={self}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setDragging(true)}
      onMouseUp={handleMouseUp}
      className={`vce-row-resizer-handler vce-row-resizer-position-${props.left ? 'left' : 'right'} ${expanded ? 'expanded' : ''}`}
    >
      <div>
        {expanded &&
          <span onClick={addColumn}>
            <i className="vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add" />
          </span>}
        <i className="seperator" />
        {expanded && <span>{props.left ? left : right}</span>}
      </div>
    </div>
  )
}

export default RowSideResizer
