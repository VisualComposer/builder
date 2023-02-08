import React from 'react'
import styled from 'styled-components'
import { commentUpdateDetails } from '../services/apiPath'
import { postData } from '../services/apiResquest'

const PriorityWrapper = styled.div`
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
const PriorityLabelWrapper = styled.div`
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
    color: ${props => props.active == props.base ? '272D3C ' : '#a4abc5'}
`

export default function PriorityTab (props) {
  const {
    priorityValue,
    taskId,
    handleUpdateTaskComment,
    wpUserId
  } = props
  const [priorityState, setPriorityState] = React.useState(0)
  const priorities_lable = [
    { Label: 'Low', value: '0', name: 'low' },
    { Label: 'Medium', value: '1', name: 'medium' },
    { Label: 'High', value: '2', name: 'high' },
    { Label: 'Critical', value: '3', name: 'critical' }
  ]

  React.useEffect(() => {
    const priority = priorities_lable.find(each => each.name === priorityValue).value
    setPriorityState(priority)
  }, [priorityValue])

  const handleSlide = (value) => {
    const selectedStatus = priorities_lable.find(each => each.value === value)
    handleChageLabel(selectedStatus)
  }

  const handleChageLabel = (value) => {
    setPriorityState(value.value)
    const commentData = {
      task_id: taskId,
      task_notify_users: wpUserId,
      value: value.name,
      method:	'priority',
      from_wp: 1
    }
    postData(commentUpdateDetails, commentData).then(res => {
      if (res.status) {
        handleUpdateTaskComment(res.task, value.name, 'priority')
      }
    })
  }
  return (
    <>
      <PriorityWrapper>
        <div style={{ width: '100%' }}>
          <div>
            <RangeSlider type="range" min="0" max="3" value={priorityState}
              onChange={({ target: { value: radius } }) => {
                setPriorityState(radius)
                handleSlide(radius)
              }}
            />
          </div>
          <PriorityLabelWrapper>
            {
              priorities_lable.map((priority) => (
                <Label
                  key={priority.value}
                  base={priority.value}
                  onClick={() => handleChageLabel(priority)}
                  active={priorityState}
                >{priority.Label}</Label>
              ))
            }
          </PriorityLabelWrapper>
        </div>
      </PriorityWrapper>
    </>
  )
}
