import { getStorage, getService } from 'vc-cake'
import React from 'react'

const RowSideResizer = (props) => {
  const workspaceStorage = getStorage('workspace')
  const documentService = getService('document')

  const self = React.useRef(null)
  const [container, setContainer] = React.useState(null)
  const [dragging, setDragging] = React.useState(false)
  const [rowId, setRowId] = React.useState(null)
  const [info, setInfo] = React.useState('auto')

  React.useEffect(() => {
    const rowContainer = self.current.closest('.vce-row-container')
    const id = rowContainer.firstChild.dataset.vcvElement
    setContainer(rowContainer)
    setRowId(id)
  }, [setContainer, setRowId])

  React.useEffect(() => {
    if (dragging) {
      // console.log('--- start dragging ---')
    } else {
      // self.current.querySelector('.vce-row-resizer-handler').style.top = null
    }
  }, [dragging])

  const addColumn = () => {
    if (props.left) {
      const row = self.current.closest('.vce-row-content')
      const cols = row.getElementsByClassName('vce-col')
      const related = cols[0].dataset.vcvElement
      workspaceStorage.trigger('add', rowId, 'column')
      setTimeout(() => workspaceStorage.trigger('move', cols[cols.length - 1].dataset.vcvElement, {
        action: 'before', related
      }), 1)
    } else {
      workspaceStorage.trigger('add', rowId, 'column')
    }
  }

  const Add = () => {
    return (
      <div className='vce-row-resizer-add' onClick={addColumn}>
        <i className='vcv-ui-icon vcv-ui-icon-add' />
      </div>
    )
  }

  const handleMouseMove = (e) => {
    if (dragging) {
      handleX(e)
      // handleY(e)
    }
  }

  const handleX = (e) => {
    const bounding = container.getBoundingClientRect()
    const row = self.current.closest('.vce-row')
    const distance = props.left
      ? e.clientX - bounding.x - 15
      : bounding.x + bounding.width - e.clientX - 15
    row.style[props.left ? 'marginLeft' : 'marginRight'] = `${Math.round(distance)}px`
    // @todo `${Math.round(distance)}px` needs to update in advanced design tab as well
  }

  /* const handleY = (e) => {
    const iframe = document.getElementById('vcv-editor-iframe').contentWindow
    const top = iframe.document.querySelector(`#el-${rowId} .vce-row-resizer-${pos()} .vce-row-resizer-handler`)
    const pageOffset = iframe.window.pageYOffset
    const position = top.getBoundingClientRect().top + pageOffset

    const distance = e.pageY - position - top.clientHeight / 2
    top.style.top = distance + 'px'
  } */

  const pos = () => {
    return props.left ? 'left' : 'right'
  }

  const Resize = () => {
    return (
      <div
        onMouseDown={() => setDragging(true)}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)}
        className={`vce-row-resizer-resize ${dragging ? 'dragging' : 'dragging'}`}
      >
        {info}
      </div>
    )
  }

  const handleMouseEnter = () => {
    const cols = documentService.children(rowId)
    const size = props.left
      ? cols[0].size.all
      : cols[cols.length - 1].size.all
    setInfo(size)
  }

  const Options = () => {
    return props.left ? <><Add /><Resize /></> : <><Resize /><Add /></>
  }

  return (
    <div
      ref={self}
      className={`vce-row-resizer-wrap vce-row-resizer-${pos()}`}
      onMouseLeave={() => setDragging(false)}
      onMouseUp={() => setDragging(false)}
    >
      <div className='vce-row-resizer-inner'>
        <div className='vce-row-resizer-inner-wrap'>
          <div className='vce-row-resizer-handler' onMouseEnter={handleMouseEnter}>
            <Options />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RowSideResizer
