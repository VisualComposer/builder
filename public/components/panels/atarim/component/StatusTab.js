import React from 'react'
import styled from 'styled-components'
import { commentUpdateDetails } from '../services/apiPath'
import { postData } from '../services/apiResquest'

const StatusWrapper = styled.div`
    display: flex !important;
    height: auto !important;
    animation: fade-in-top 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both !important;
`
const RangeSlider = styled.input`
    -webkit-appearance: none !important;
    width: 100% !important;
    position: relative !important;
    border: none !important;
    padding: 0px 10px !important;
    background-color: #ecf3f9 !important;
    border-radius: 50px !important;
    box-sizing: border-box !important;
    height: 10px !important;
    outline: none !important;
`
const StatusLabelWrapper = styled.div`
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    font-family: 'Roboto' !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: "#a4abc5"
`
const Label = styled.span`
    cursor: pointer !important;
    padding: 0 10px !important;
    color: ${props => props.active == props.base ? '272D3C ' : '#a4abc5'};
    position: absolute;
    left: ${props => props.left};
`

export default function StatusTab (props) {
  const {
    statusValue,
    taskId,
    handleUpdateTaskComment,
    wpUserId
  } = props
  const [StatusState, setStatusState] = React.useState(0)
  const labelRef = React.useRef(null)
  const status_lable = [
    { Label: 'Open', value: '0', name: 'open', left: '-2%' },
    { Label: 'In-prog', value: '1', name: 'in-progress', left: '27%' },
    { Label: 'Review', value: '2', name: 'pending-review', left: '57%' },
    { Label: 'Compl', value: '3', name: 'complete', left: '86%' }
  ]

  React.useEffect(() => {
    const status = status_lable.find(each => each.name === statusValue).value
    setStatusState(status)
  }, [statusValue])

  const handleSlide = (value) => {
    const selectedStatus = status_lable.find(each => each.value === value)
    handleChageLabel(selectedStatus)
  }

  const handleChageLabel = (value) => {
    setStatusState(value.value)
    const commentData = {
      task_id: taskId,
      task_notify_users: wpUserId,
      value: value.name,
	  method:	'status',
      from_wp: 1
    }
    postData(commentUpdateDetails, commentData).then(res => {
      if (res.status) {
        handleUpdateTaskComment(res.task, value.name, 'status')
      }
    })
  }

  return (
    <>
      <StatusWrapper>
        <div style={{ width: '100%' }}>
          <div>
            <RangeSlider type="range" min="0" max="3" value={StatusState}
              onChange={({ target: { value: radius } }) => {
                setStatusState(radius)
                handleSlide(radius)
              }}
            />
          </div>
          <StatusLabelWrapper>
            {
              status_lable.map((status) => (
                <Label
                  key={status.value}
                  base={status.value}
                  onClick={() => handleChageLabel(status)}
                  active={StatusState}
                  left={status.left}
                >{status.Label}</Label>
              ))
            }
          </StatusLabelWrapper>
        </div>
      </StatusWrapper>
    </>
  )
}
