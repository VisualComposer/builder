import React from 'react'
import styled from 'styled-components'
import { BiSearchAlt2 } from 'react-icons/bi'
import { removeTags, statusAvatarColor, urgencyAvatarColor } from './utils/helpers'

const TaskWrapper = styled.ul`
    // background-color:red;
    // padding: 10px
`
const TaskItem = styled.li`
    list-style: none;
    align-items: flex-start;
    display: flex;
    position: relative;
    margin-left: 0;
    padding: 10px 10px;
    transition: 0.2s !important;
    background-color: transparent;
    outline: none !important;
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    border-bottom: 1px solid #dde5ef;
    cursor: pointer;
    text-align: left;
    justify-content: space-between;
    &:hover {
      background-color: #dde5ef
    }
`
const TaskNumber = styled.div`
    width: 32px;
    min-width: 32px;
    height: 32px;
    order: 2;
    font-size: 12px;
    color: rgba(255,255,255,0.9);
    font-family: 'Roboto', sans-serif;
    font-weight: 700 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 0;
    overflow: hidden;
    border-radius: 15% 50% 50% 50%;
    transition: all 0.2s ease-in !important;
    background: ${props => statusAvatarColor[props.status]};
`
const TaskUrgency = styled.span`
    border-radius: 50%;
    position: absolute;
    top: -10px;
    right: -1px;
    width: 12px;
    height: 27px;
    box-shadow: 0px 1px 11px #00000042;
    transform: rotate(-44deg);
    border: 0px;
    display: block !important;
    background-color: ${props => urgencyAvatarColor[props.priority]};
`
const TaskContentWrapper = styled.div`
    width: calc(100% - 35px);
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    text-align: left;
    color: #4B4B4B;
    font-size: 15px;
    font-family: 'Roboto', sans-serif;
    transition: all 0.2s ease-in !important;
`
const TaskAuthor = styled.div`
    font-size: 13px;
    color: #363d4d;
    vertical-align: top;
    display: block;
    font-weight: 500;
    text-transform: capitalize;
    margin-bottom: 5px;
`
const TaskText = styled.div`
    line-height: 1.2;
    white-space: normal;
    font-size: 14px;
    color: #89879f;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`
const TaskLoader = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`
const TaskNotFound = styled.div`
  color: #4A5568;
  display: block;
  padding: 10px;
  margin-top: 15vh;
  text-align: center;
`
const TaskNotFoundText = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`
const TaskNotFoundImg = styled.img`
  opacity: 0.7;
`
export default function Sidebar (props) {
  const {
    handleClickTask,
    taskList,
    taskData,
    handleSetSearchedTask,
    isLoadingTask
  } = props

  const handleSearchTitle = (e) => {
    if (Object.keys(taskData).length !== 0) {
      const titleSearch = e.target.value
      const result = taskData.data.filter(each => removeTags(each.task.task_title).toLowerCase().includes(titleSearch.toLowerCase()))
      handleSetSearchedTask(result)
    }
  }

  return (
    <>
      {
        isLoadingTask
          ? <TaskLoader>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto', color: '#8791B2!important' }} width="75px" height="75px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="task-content">
              <circle cx="84" cy="50" r="10" fill="#93dbe9" >
                <animate attributeName="r" repeatCount="indefinite" dur="0.25s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>
                <animate attributeName="fill" repeatCount="indefinite" dur="1s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#93dbe9;#3b4368;#5e6fa3;#689cc5;#93dbe9" begin="0s"></animate>
              </circle><circle cx="16" cy="50" r="10" fill="#93dbe9" >
                <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
                <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
              </circle><circle cx="50" cy="50" r="10" fill="#689cc5" >
                <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
                <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
              </circle><circle cx="84" cy="50" r="10" fill="#5e6fa3" >
                <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
                <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
              </circle><circle cx="16" cy="50" r="10" fill="#3b4368" >
                <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
                <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
              </circle>
            </svg>
          </TaskLoader>
          : <>
            <div className="sidebar-search-container" >
              <div className="search-box">
                <BiSearchAlt2 className="close-icon"/>
                <input className="search-input" type="text" placeholder="Search by task title" onKeyUp={handleSearchTitle} />
              </div>
            </div>
            {
              taskList.length === 0
                ? <><TaskNotFound>
                  <TaskNotFoundText>
                      No tasks found
                  </TaskNotFoundText>
                  <TaskNotFoundImg src='https://wpfeedback-image.s3.us-east-2.amazonaws.com/images/WPF-notasks.svg' alt='not found'/>
                </TaskNotFound>
                </>

                : <TaskWrapper>
                  {
                    taskList.map((task, i) => (
                      <TaskItem
                        onClick={() => handleClickTask(task)}
                        key={task.task.id}
                      >
                        <TaskNumber
                          status = {task.task.task_status}
                        >
                          <TaskUrgency
                            priority = {task?.task?.task_priority}
                          ></TaskUrgency>
                          {task?.task?.task_comment_id}
                        </TaskNumber>
                        <TaskContentWrapper>
                          <TaskAuthor>
                            {task.task.task_config_author_name}
                            <Tasklottie-playerDate>{task?.task?.task_time}</Tasklottie-playerDate>
                          </TaskAuthor>
                          <TaskText
                            dangerouslySetInnerHTML={{ __html: task.task.task_title ? removeTags(task.task.task_title) : 'No Subject' }}
                          >
                          </TaskText>
                        </TaskContentWrapper>
                      </TaskItem>
                    ))
                  }
                </TaskWrapper>
            }
          </>
      }
    </>
  )
}
