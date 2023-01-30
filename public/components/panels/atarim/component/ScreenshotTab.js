import React from 'react'
import styled from 'styled-components'

const ScreenshotWrapper = styled.div`
    height: auto !important;
    animation: fade-in-top 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both !important;
`
const ScreenshotDIv = styled.img`
    width: 100% !important;
    height: 100% !important;
    border-radius: 5px !important;
    margin: 10px 0 !important;
    cursor: pointer;
    box-shadow: 0 0 15px rgb(0 0 0 / 20%) !important;
    // box-shadow: -2px 7px 12px -7px rgb(0 0 0 / 40%);

`

export default function ScreenShotTab (props) {
  const {
    screenshot
  } = props

  return (
    <>
      <ScreenshotWrapper>
        <ScreenshotDIv title='Open In New Tab' src={screenshot} alt='screenshot' onClick={() => window.open(screenshot, '_blank')} />
      </ScreenshotWrapper>
    </>
  )
}
