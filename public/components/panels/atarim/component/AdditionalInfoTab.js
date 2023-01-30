import React from 'react'
import styled from 'styled-components'

const DetailWrapper = styled.div`
    height: auto !important;
    animation: fade-in-top 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both !important;
`
const InfoWrapper = styled.div`
  display: block !important;
  width: 100% !important;
  max-height: 150px !important;
  overflow-y: scroll !important;
  overflow-x: hidden !important;
  font-family: 'Roboto' !important;
  line-height: 1.4 !important;
  font-size: 14px !important;
  margin-bottom: 10px !important;
  color: #A4ABC5 !important;
  padding: 10px !important;
  &::-webkit-scrollbar-thumb {
    background: #D5E2F3 !important;
    border-radius: 50px !important;
    border: 0 !important;
    padding: initial !important;
    box-shadow: none !important;
    min-height: 0 !important;
    background-clip: initial !important;
 };
 &::-webkit-scrollbar {
    width: 7px !important;
    height: 7px !important;
}
`
const Label = styled.label`
    display: block !important;
    font-family: 'Roboto' !important;
    font-weight: 500 !important;
    color: #4a5568 !important;
`

const InfoContainer = styled.span`
    margin-bottom: 10px !important;
    font-family: 'Roboto' !important;
    display: block !important;
`

export default function AdditionalInfoTab (props) {
  const {
    browser,
    createdBy,
    taskId,
    siteName,
    PageUrl,
    PageName,
    screenSizeX,
    screenSizeY

  } = props
  const [addInfo] = React.useState([
    { name: 'Screen Size', value: `${screenSizeX} X ${screenSizeY}` },
    { name: 'Browser', value: browser },
    { name: 'Created by', value: createdBy },
    { name: 'Task ID', value: taskId },
    { name: 'Site Name', value: siteName },
    { name: 'Task Page URL', value: PageUrl },
    { name: 'Task Page Name', value: PageName }
  ])

  return (
    <>
      <DetailWrapper>
        <InfoWrapper>
          {
            addInfo.map(info => (
              <div key={info.name}>
                <Label>{info.name}</Label>
                <InfoContainer>{info.value}</InfoContainer>
              </div>
            ))
          }
        </InfoWrapper>
      </DetailWrapper>
    </>
  )
}
