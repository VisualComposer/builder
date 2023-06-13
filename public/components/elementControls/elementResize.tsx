import React, { useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Dispatch } from 'redux' // eslint-disable-line
import vcCake from 'vc-cake'
import { updateDesignOptionsBoxModel } from '../../sources/attributes/designOptionsAdvanced/helpers'
import { columnResizeDataChanged } from '../../editor/stores/controls/slice'

const cook = vcCake.getService('cook')
const documentService = vcCake.getService('document')
const elementsStorage = vcCake.getStorage('elements')
const layoutStorage = vcCake.getStorage('layout')
const dataManager = vcCake.getService('dataManager')

const localizations = dataManager.get('localizations')

interface ContainerPos {
  top: number,
  left: number,
  width: number,
  height: number
}

const initialContainerPos: ContainerPos = {
  top: 0,
  left: 0,
  width: 0,
  height: 0
}

interface ColumnData {
  mode?: string,
  id?: string
}

interface Props {
  resizeControlData: {
    vcElementContainerId?: string
  }
  columnResizeDataChanged: (data: ColumnData) => void
}

function updateContainerPosition (iframe: HTMLIFrameElement, vcElementId: string) {
  const iframeDocument = iframe?.contentDocument
  if (!iframeDocument || !vcElementId) {
    return initialContainerPos
  }
  const contentElement = iframeDocument.querySelector(`[data-vcv-element="${vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
  if (!contentElement) {
    return initialContainerPos
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

function addNewColumn (action: string, vcElementContainerId: string) {
  const columns = documentService.children(vcElementContainerId)
  const related = action === 'before' ? columns[0].id : columns[columns.length - 1].id
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

function getDistanceValues (rowElement: HTMLElement | null | undefined) {
  let left = 0
  let right = 0

  if (rowElement) {
    const initialStyles = window.getComputedStyle(rowElement)
    left = parseInt(initialStyles.getPropertyValue('margin-left'))
    right = parseInt(initialStyles.getPropertyValue('margin-right'))
  }

  return {
    leftDistance: left,
    rightDistance: right
  }
}

const ElementResize: React.FC<Props> = (props) => {
  const { vcElementContainerId } = props.resizeControlData
  const [isResizing, setResizing] = useState(false)

  const [containerPos, setContainerPos] = useState(initialContainerPos)
  const iframeElement = document.getElementById('vcv-editor-iframe') as HTMLIFrameElement
  const [iframe, setIframe] = useState(iframeElement)
  const rowElement: HTMLElement | null | undefined = iframeElement?.contentDocument?.getElementById(`el-${vcElementContainerId}`)
  const distances = getDistanceValues(rowElement)
  const [leftDistance, setLeftDistance] = useState(distances.leftDistance)
  const [rightDistance, setRightDistance] = useState(distances.rightDistance)
  const [row, setRow] = useState(rowElement)
  const [resizerSide, setResizerSide] = useState('')
  const [resizerPosition, setResizerPosition] = useState({})

  const setResizeLabelsPosition = useCallback((clientY: number) => {
    const resizerHeight = 29
    if (containerPos.top !== undefined) {
      const labelPosition = clientY - containerPos.top - (resizerHeight / 2)
      setResizerPosition({
        position: 'absolute',
        top: `${labelPosition}px`
      })
    }
  }, [containerPos])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (row?.parentElement) {
      const isLeft = resizerSide === 'left'
      const iframeOffset = iframe.getBoundingClientRect().left
      const bounding = row.parentElement.getBoundingClientRect()
      let distance = isLeft ? (e.clientX - bounding.x - iframeOffset) : (e.clientX - (bounding.x + bounding.width) - iframeOffset) * -1

      // Prevent Resizer to overflow popup container
      const editorType = dataManager.get('editorType')
      if (editorType === 'popup' && distance < -47) {
        return
      }
      // Snap to grid
      if (distance > -5 && distance < 5) {
        distance = 0
      }

      const bothDistances = distance + (isLeft ? rightDistance : leftDistance)
      if (50 + bothDistances > bounding.width) { // don't allow to make smaller than 50px
        distance = isLeft ? leftDistance : rightDistance
      }
      if (vcElementContainerId) {
        const position: ContainerPos = updateContainerPosition(iframe, vcElementContainerId)
        setContainerPos(position)
        if (isLeft) {
          setLeftDistance(Math.round(distance))
        } else {
          setRightDistance(Math.round(distance))
        }
        row.style[isLeft ? 'marginLeft' : 'marginRight'] = `${Math.round(distance)}px`
        setResizeLabelsPosition(e.clientY)
      }
    }
  }, [row, resizerSide, vcElementContainerId, setResizeLabelsPosition, iframe, leftDistance, rightDistance])

  const handleMouseUp = useCallback(() => {
    iframe.style.pointerEvents = ''
    iframe.style.userSelect = ''
    document.body.style.userSelect = ''
    const fieldProperty = resizerSide === 'left' ? 'marginLeft' : 'marginRight'
    const fieldValue = resizerSide === 'left' ? leftDistance : rightDistance
    if (vcElementContainerId) {
      updateDesignOptionsBoxModel(vcElementContainerId, fieldProperty, `${fieldValue}px`)
    }
    window.setTimeout(() => {
      if (row) {
        row.style.marginLeft = ''
        row.style.marginRight = ''
      }
    }, 150)

    setResizerSide('')
    setResizing(false)
    vcCake.setData('vcv:layoutCustomMode', false)
    vcCake.setData('vcv:layoutColumnResize', null)
    layoutStorage.state('interactWithContent').set(false)
  }, [row, iframe, leftDistance, rightDistance, vcElementContainerId, resizerSide])

  useEffect(() => {
    if (vcElementContainerId) {
      const iframeElement = document.getElementById('vcv-editor-iframe') as HTMLIFrameElement
      const position: ContainerPos = updateContainerPosition(iframeElement, vcElementContainerId)
      setContainerPos(position)
      const rowElement: HTMLElement | null | undefined = iframe?.contentDocument?.getElementById(`el-${vcElementContainerId}`)
      setRow(rowElement)
      setIframe(iframeElement)
      const distances = getDistanceValues(rowElement)
      setLeftDistance(distances.leftDistance)
      setRightDistance(distances.rightDistance)
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

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>, side: string) => {
    if (event.nativeEvent.which !== 1) {
      return
    }
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
    setResizeLabelsPosition(event.clientY)
  }

  const handleMouseEnter = () => {
    props.columnResizeDataChanged({
      mode: 'columnResizerHover',
      id: vcElementContainerId
    })

    const hideControlsInterval = layoutStorage.state('hideControlsInterval').get()
    if (hideControlsInterval) {
      clearInterval(hideControlsInterval)
      layoutStorage.state('hideControlsInterval').set(false)
    }
  }

  const handleMouseLeave = () => {
    props.columnResizeDataChanged({})
  }

  const handlePlusClick = (event: React.MouseEvent<HTMLElement>, action: string) => {
    event.stopPropagation()
    if (event.nativeEvent.which !== 1) {
      return
    }
    addNewColumn(action, vcElementContainerId)
    window.setTimeout(() => {
      vcCake.setData('vcv:layoutColumnResize', vcElementContainerId)
    }, 50)
  }

  let styles = {}
  if (containerPos.height && containerPos.width) {
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

  const columnBeforeText = localizations.addColumnBefore || 'Add column before'
  const columnAfterText = localizations.addColumnAfter || 'Add column after'
  const marginText = localizations.rowMargin || 'Row margin'

  const resizerClasses = classNames({
    'vce-column-resizer vce-column-resizer--side': true,
    'vce-column-resizer--no-resize': !!row?.getAttribute('data-vce-full-width')
  })

  return (
    <div className={resizerClasses} style={{ ...styles }}>
      <div
        className='vce-column-resizer-handler vce-element-resize--left'
        onMouseDown={(event) => {
          handleMouseDown(event, 'left')
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className='vce-column-resizer-label-container vce-column-resizer-label--side'
          style={leftLabelStyles}
        >
          <div className='vce-column-resizer-label vce-column-resizer-label-left vce-add-column-container'>
            <span className='vce-column-resizer-label-percentage' title={marginText}>{leftDistance}px</span>
          </div>
          <div className='vce-column-resizer-label vce-column-resizer-label-right'>
            <span
              className='vce-column-resizer-label-percentage vce-add-column'
              title={columnBeforeText}
              onMouseDown={(event) => {
                handlePlusClick(event, 'before')
              }}
            >
              <i className='vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </div>
        </div>
      </div>

      <div
        className='vce-column-resizer-handler vce-element-resize--right'
        onMouseDown={(event) => {
          handleMouseDown(event, 'right')
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className='vce-column-resizer-label-container vce-column-resizer-label--side'
          style={rightLabelStyles}
        >
          <div className='vce-column-resizer-label vce-column-resizer-label-left'>
            <span
              className='vce-column-resizer-label-percentage vce-add-column'
              title={columnAfterText}
              onMouseDown={(event) => {
                handlePlusClick(event, 'after')
              }}
            >
              <i className='vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </div>
          <div className='vce-column-resizer-label vce-column-resizer-label-right vce-add-column-container'>
            <span className='vce-column-resizer-label-percentage' title={marginText}>{rightDistance}px</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: { controls: Props }) => ({
  resizeControlData: state.controls.resizeControlData
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  columnResizeDataChanged: (data: ColumnData) => dispatch(columnResizeDataChanged(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ElementResize)
