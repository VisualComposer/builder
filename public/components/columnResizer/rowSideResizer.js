import { getStorage, getService } from 'vc-cake'
import React from 'react'

const RowSideResizer = (props) => {
  const workspaceStorage = getStorage('workspace')
  const documentService = getService('document')

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
      handleBar(e, bounding, row)
    }
  }

  const handleBar = (e, bounding, row) => {
    const distance = props.left
      ? e.pageX - bounding.x
      : bounding.x + bounding.width - e.pageX
    const margin = /* distance > 0 ? */ `${Math.round(distance)}px` /* : 'auto' */
    row.style[props.left ? 'marginLeft' : 'marginRight'] = margin
    props.left ? setLeft(margin) : setRight(margin)
    return margin
  }

  const addColumn = () => {
    if (!dragging) {
      const rowId = container.firstChild.dataset.vcvDndElement
      if (props.left) {
        const row = self.current.closest('.vce-row-content')
        const cols = row.getElementsByClassName('vce-col')
        const firstColId = cols[0].dataset.vcvElement
        workspaceStorage.trigger('add', rowId, 'column')
        setTimeout(() => workspaceStorage.trigger('move', cols[cols.length - 1].dataset.vcvElement, {
          action: 'before', related: firstColId
        }), 1)
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
      <div className={'vce-row-resizer-inner'} >
        <span className={'vce-row-resizer-inner-side'} onClick={addColumn}>
          <i className='vcv-ui-icon vcv-ui-icon-add' />
        </span>
        <i className='separator' />
        <span className={'vce-row-resizer-inner-side'}>{props.left ? left : right}</span>
      </div>
    </div>
  )
}

export default RowSideResizer
