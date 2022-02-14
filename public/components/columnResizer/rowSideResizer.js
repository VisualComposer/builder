import { getStorage } from 'vc-cake'
import React from 'react'

const RowSideResizer = (props) => {
  const workspaceStorage = getStorage('workspace')

  const [container, setContainer] = React.useState(undefined)
  const [dragging, setDragging] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [right] = React.useState('auto')
  const [left] = React.useState('auto')
  const self = React.useRef(null)

  React.useEffect(() => setContainer(() => self.current.closest('.vce-row-container')), [])

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

  return (
    <div
      ref={self}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      className={`vce-row-resizer-handler vce-row-resizer-position-${props.left ? 'left' : 'right'} ${expanded ? 'expanded' : ''}`}
    >
      <div>
        {expanded &&
          <span onClick={addColumn}>
            <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
          </span>}
        <i className='separator' />
        {expanded && <span>{props.left ? left : right}</span>}
      </div>
    </div>
  )
}

export default RowSideResizer
