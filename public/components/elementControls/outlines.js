import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { ControlHelpers } from './controlHelpers'

const getPosition = (element) => {
  if (!element) {
    return {}
  }
  const { top, left, width, height } = element.getBoundingClientRect()
  return { top, left, width, height }
}

const Outlines = (props) => {
  const { selector, id } = props.outlineData

  const iframeElement = document.getElementById('vcv-editor-iframe')
  const [iframe, setIframe] = useState(iframeElement)
  const el = iframe?.contentDocument?.querySelector(selector)

  const [element, setElement] = useState(el)
  const [position, setPosition] = useState(getPosition(el))

  useEffect(() => {
    const iframeElement = document.getElementById('vcv-editor-iframe')
    setIframe(iframeElement)
    const el = iframe?.contentDocument?.querySelector(selector)
    setElement(el)
    setPosition(getPosition(el))
  }, [selector, iframe])

  useEffect(() => {
    if (element) {
      setPosition(getPosition(element))
    }
  }, [element])

  if (!element || props.columnResizeData?.mode) {
    return null
  }

  const vcElement = ControlHelpers.getVcElement(id)
  const colorIndex = ControlHelpers.getElementColorIndex(vcElement)

  const classes = classNames({
    'vcv-ui-element-outline vcv-ui-element-outline-type-custom': true,
    [`vcv-ui-element-outline-type-index-${colorIndex}`]: true,
    'vcv-state--visible': true
  })

  const styles = {
    top: position.top,
    left: position.left,
    width: position.width,
    height: position.height
  }

  return (
    <svg className={classes} style={styles} />
  )
}

const mapStateToProps = (state) => ({
  outlineData: state.controls.outlineData,
  columnResizeData: state.controls.columnResizeData
})

export default connect(mapStateToProps)(Outlines)
