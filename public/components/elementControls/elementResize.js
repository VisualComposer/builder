import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')
const documentService = vcCake.getService('document')
const elementsStorage = vcCake.getStorage('elements')
const layoutStorage = vcCake.getStorage('layout')

function updateContainerPosition (vcElementId, iframe) {
  const iframeDocument = iframe?.contentDocument
  if (!iframeDocument) {
    return false
  }
  const contentElement = iframeDocument.querySelector(`[data-vcv-element="${vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
  if (!contentElement) {
    return false
  }
  const elementRect = contentElement.getBoundingClientRect()

  let posTop = elementRect.top
  let posLeft = elementRect.left
  if (iframe.tagName.toLowerCase() !== 'iframe') {
    const iframeRect = iframe.getBoundingClientRect()
    posTop -= iframeRect.top
    posLeft -= iframeRect.left
  }
  return {
    top: posTop,
    left: posLeft,
    width: elementRect.width,
    height: elementRect.height
  }
}

function addNewColumn (action, iframeDocument, vcElementContainerId) {
  const columns = documentService.children(vcElementContainerId)
  const related = action === 'before' ? columns[0].id : columns[columns.length-1].id
  const colSettings = {
    tag: 'column',
    parent: vcElementContainerId
  }
  const columnData = cook.get(colSettings)
  const options = {
    action: action,
    related: related,
    options: { silent: true }
  }
  elementsStorage.trigger('add', columnData.toJS(), true, {})
  if (action === 'before') {
    elementsStorage.trigger('move', columnData.get('id'), options)
  }
}

const ElementResize = ({ data = {} }) => {
  const { vcElementContainerId } = data
  const helper = useRef(null)
  const leftResizer = useRef(null)
  const rightResizer = useRef(null)
  const [isResizing, setResizing] = useState(false)
  const [containerPos, setContainerPos] = useState(false)
  const iframeElement = document.getElementById('vcv-editor-iframe')
  const [iframe, setIframe] = useState(iframeElement)
  const [row, setRow] = useState(iframe?.contentDocument?.getElementById(`el-${vcElementContainerId}`))
  const [resizerSide, setResizerSide] = useState('')
  const [resizerPosition, setResizerPosition] = useState({})

  const setResizeLabelsPosition = useCallback((e) => {
    const resizer = resizerSide === 'left' ? leftResizer : rightResizer
    const resizerHeight = resizer.current.getBoundingClientRect().height
    const labelPosition = e.clientY - helper.current.getBoundingClientRect().top - (resizerHeight / 2)
    setResizerPosition({
      position: 'absolute',
      top: `${labelPosition}px`
    })
  })

  const handleMouseMove = useCallback((e) => {
    if (row) {
      const isLeft = resizerSide === 'left'
      const iframeOffset = iframe.getBoundingClientRect().left
      const bounding = row.parentElement.getBoundingClientRect()
      let distance = isLeft ? (e.clientX - bounding.x - iframeOffset) :  (e.clientX - (bounding.x + bounding.width) - iframeOffset) * -1

      // Snap to grid
      if (distance > -5 && distance < 5) {
        distance = 0
      }

      setContainerPos(updateContainerPosition(vcElementContainerId, iframe))
      row.style[isLeft ? 'marginLeft' : 'marginRight'] = `${Math.round(distance)}px`
      setResizeLabelsPosition(e)

    }
  }, [row, resizerSide, vcElementContainerId]);

  const handleMouseUp = useCallback(() => {
    iframe.style.pointerEvents = ''
    iframe.style.userSelect = ''
    document.body.style.userSelect = ''
    setResizerSide('')
    setResizing(false)
    vcCake.setData('vcv:layoutCustomMode', false)
    vcCake.setData('vcv:layoutColumnResize', null)
  }, [])

  useEffect(() => {
    if (vcElementContainerId) {
      const iframeElement = document.getElementById('vcv-editor-iframe')
      setContainerPos(updateContainerPosition(vcElementContainerId, iframeElement))
      const rowElement = iframe?.contentDocument?.getElementById(`el-${vcElementContainerId}`)
      setRow(rowElement)
      setIframe(iframeElement)
    }
  }, [vcElementContainerId, iframe])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  if (!vcElementContainerId) {
    return null
  }

  const handleMouseDown = (side) => {
    iframe.style.pointerEvents = 'none'
    iframe.style.userSelect = 'none'
    document.body.style.userSelect = 'none'

    setResizerSide(side)
    setResizing(true)

    vcCake.setData('vcv:layoutCustomMode', {
      mode: 'elementResize',
      options: {}
    })
    vcCake.setData('vcv:layoutColumnResize', vcElementContainerId)

    const hideControlsInterval = layoutStorage.state('hideControlsInterval').get()
    if (hideControlsInterval) {
      clearInterval(hideControlsInterval)
      layoutStorage.state('hideControlsInterval').set(false)
    }
  }

  const handlePlusClick = (event, action) => {
    event.stopPropagation()
    addNewColumn(action, iframe?.contentDocument, vcElementContainerId)
  }

  let styles = {}
  if (containerPos) {
    styles = {
      top: `${containerPos.top}px`,
      left: `${containerPos.left}px`,
      width: `${containerPos.width}px`,
      height: `${containerPos.height}px`
    }
  }

  let leftLabelStyles = {}
  let rightLabelStyles = {}

  if (isResizing) {
    if (resizerSide === 'left') {
      leftLabelStyles = resizerPosition
    } else {
      rightLabelStyles = resizerPosition
    }
  }

  return (
    <div className='vce-column-resizer vce-column-resizer--side vcvhelper' style={{ ...styles }} ref={helper}>

      <div
        className='vce-column-resizer-handler'
        onMouseDown={() => { handleMouseDown('left') }}
      >
        <div className='vce-column-resizer-label-container vce-column-resizer-label--side' style={leftLabelStyles} ref={leftResizer}>
          <div className='vce-column-resizer-label vce-column-resizer-label-left vce-add-column-container'>
            <span
              className='vce-column-resizer-label-percentage vce-add-column'
              title='Add column before'
              onClick={(event) => { handlePlusClick(event, 'before') }}
            >
              <i className='vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </div>
          <div className='vce-column-resizer-label vce-column-resizer-label-right'>
            <span className='vce-column-resizer-label-percentage'>50%</span>
          </div>
        </div>
      </div>

      <div
        className='vce-column-resizer-handler'
        onMouseDown={() => { handleMouseDown('right') }}
      >
        <div className='vce-column-resizer-label-container vce-column-resizer-label--side' style={rightLabelStyles} ref={rightResizer}>
          <div className='vce-column-resizer-label vce-column-resizer-label-left'>
            <span className='vce-column-resizer-label-percentage'>50%</span>
          </div>
          <div className='vce-column-resizer-label vce-column-resizer-label-right vce-add-column-container'>
            <span
              className='vce-column-resizer-label-percentage vce-add-column'
              title='Add column after'
              onClick={(event) => { handlePlusClick(event, 'after') }}
            >
              <i className='vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

const mapStateToProps = state => ({
  data: state.controls.resizeControlData
})

export default connect(mapStateToProps)(ElementResize)
