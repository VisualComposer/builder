/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import { RxDoubleArrowLeft } from 'react-icons/rx'
import {
  FiBell, FiDownload, FiEyeOff, FiPaperclip, FiTrash2
} from 'react-icons/fi'
import { FaRegStickyNote } from 'react-icons/fa'
import UserTab from './component/UserTab'
import PriorityTab from './component/PriorityTab'
import { statusAvatarColor, urgencyAvatarColor, videoIdGenerator } from './utils/helpers'
import StatusTab from './component/StatusTab'
import ScreenShotTab from './component/ScreenshotTab'
import AdditionalInfoTab from './component/AdditionalInfoTab'
import TransBack from './media/trans_back_atarim.svg'
import { postData, postUploadFile } from './services/apiResquest'
import { commentApi, commentUpdateDetails, uploadFileAPi } from './services/apiPath'

const CommentsContainer = styled.div`
    animation: fadeInDown 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    flex-flow: column nowrap;
    flex-grow: 1;
    overflow-x: hidden;
    flex-direction: column;
    padding:5px;
    flex-grow: 1;
    & + &  {
        marginTop: "auto !important",
    }

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

const Comment = styled.div`
    display: flex;
    margin-bottom: 1.6rem;
    position: relative;
    &:hover: {
        backgroundColor: #F2F3F3
    }
`
const CommentSec = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    align-items: flex-start
`
const CommentText = styled.p`
    widthcolor: #272D3C;
    margin: 0;
    padding: 0;
    flex-grow: 1;
    font-weight: 400;
`
const CommentSentAt = styled.p`
    color: #A4ABC5;
    font-size: 14px;
    text-align: right;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
`
const CommentNormal = styled.div`
    display: flex;
    width: 100%;

`
const CommentSentBy = styled.div`
    color: #A4ABC5;
    font-size: 14px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-weight: 500;
    line-height: 1;
`
const Chip = styled.div`
    color: #272D3C !important;
    padding: 0px 5px !important;
    font-family: Roboto, Helvetica, Arial, sans-serif !important;
    font-weight: 500 !important;
    height: 20px !important;
    font-size: 12px !important;
    margin-left: 5px !important;
    border-radius: 50px !important;
    background-color: #ecf3f9 !important;
`
const CommentContainer = styled.div`
    color: #4A5568;
    font-size: 14px;
    word-wrap: break-word;
    & figure {
        margin: 0 !important;
        & img {
            margin: 0 !important;
        }
    }
    & p {
        margin: 0;
        }
`
const CommentWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column
`

const CommentTextAreaWrapper = styled.div`
    position: relative;
`

const CommentTextArea = styled.textarea`
    color: #4a5568;
    width: 100%;
    border: 0;
    height: 100px;
    resize: vertical;
    padding: 15px;
    font-size: 14px;
    background: #ecf3f9;
    box-sizing: border-box;
    min-height: 80px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    border-radius: 8px;
    &:focus {
        border: none;
        outline: 0;
        box-shadow: none;
    }
    ::placeholder,
    ::-webkit-input-placeholder {
        font-style: italic;
    }
    :-ms-input-placeholder {
        font-style: italic;
    }
`

const FileUploadWrapper = styled.div`
    position: absolute;
    bottom: 8px;
    right: 20px;
`

const InputFile = styled.input`
    opacity: 0;
    position: absolute;
`

const ActionWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
    margin-top: 5px;

`

const CommentButton = styled.button`
    color: #272D3C;
    height: 36px;
    font-size: 14px;
    max-height: 36px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    margin-left: 10px;
    border-radius: 5px;
    background-color: #3ed696;
    box-sizing: border-box;
    padding: 6px 16px;
    min-width: 64px;
    font-weight: 500;
    border: none;
    margin-right: 5px;
    cursor: pointer;
    &:hover {
        background-color: #56c78a
      }

`

const NoteButton = styled.button`
    color: #272D3C;
    width: 36px;
    height: 36px;
    font-size: 14px;
    min-width: 36px;
    max-height: 36px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    line-height: 1;
    border-radius: 50% 15% 50% 50%;
    background-color: #FEC90D;
    border: none;
    margin-right: 5px;
    cursor: pointer;
    &:hover {
        background-color: #e2b30c
      }

`
const InternalButton = styled.div`
    color: ${props => props.isInternal ? '#fff' : '#002157'};
    border: 2px solid #272D3C;
    height: 36px;
    display: flex;
    overflow: hidden;
    min-width: 36px;
    transition: all 0.2s ease-out;
    align-items: center;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    border-radius: 15% 50% 50% 50%;
    justify-content: center;
    background: ${props => props.isInternal ? '#002157' : '#fff'};
    cursor: pointer;
    &:hover {
        background-color: #272d3c;
        color: #ffff
      }

`

const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between
`

const NavToolWrapper = styled.div`
    display: flex;
    align-items: center;
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

const ToolButton = styled.button`
    padding: 0 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    height: 26px !important;
    width: 26px !important;
    opacity: ${props => props.activeTab ? 1 : 0.3};
    margin-right: 10px !important;
    background-color: transparent !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    color: #002157 !important;
    visibility: visible !important;
    &:hover {
        opacity: 1;
      }
`

const TabWrapper = styled.div`
    padding: ${props => props.status ? '10px 0 30px 0' : '10px 0'};
    visibility: visible !important;
    display: block !important;
    appearance: auto !important;
    width: 100% !important;
`
const AvatarWrapper = styled.div`
    min-width: 32px !important;
    height: 32px !important;
    width: 32px !important;
    align-items: center !important;
    border-radius: 50% !important;
    display: flex !important;
`

const AvatarImage = styled.img`
    height: 32px !important;
    width: 32px !important;
    border-radius: 50% !important;
    margin: 0 !important;
`
const AvatarTextWrapper = styled.div`
    min-width: 32px !important;
    height: 32px !important;
    width: 32px !important;
    align-items: center !important;
    border-radius: 50% !important;
    display: flex !important;
    background-color: rgb(255, 64, 128);
`

const AvatarText = styled.div`
    font-size: 12px !important;
    font-weight: 400 !important;
    line-height: 1 !important;
    margin: auto !important;
    color: #fff !important;
    text-transform: uppercase !important;
`
const Iframe = styled.iframe`
    width: 100%;
    height: 250px
`
const CommentLinkWrapper = styled.div`
    display: flex;
`
const CommentLink = styled.a`
    font-size: 14px;
    text-decoration: none;
    color: #106339;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    &:visited: {
        color: "#106339"
    }
`

const ImageContainer = styled.div`
    position: relative;
    display: inline-flex;
    animation: fade-in-top 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both !important;
    transition: all 0.3s ease-out;
    margin-top: 7px;
    &:hover: {
        boxShadow: 0 6px 24px 0 rgba(18,43,70,.2):
    },
`

const ImageContent = styled.img`
    position: relative;
    cursor: pointer;
    outline: #fff solid 10px;
    border: 1px solid #EFF2F6;
    border-radius: 5px;
    width: 400px;
    max-width: 100%;
    background: #fff;
    &:hover: {
        opacity: 0.9;
    }
`

export default function TaskContent (props) {
  const {
    handleClickTask,
    selectedTask,
    handleUpdateTaskComment,
    wpUserId
  } = props
  const [activeTab, setActiveTab] = React.useState('screenshot')
  const [commentText, setCommentText] = React.useState('')
  const [isCommenting, setIsComment] = React.useState(false)
  const [isInternal, setIsInternal] = React.useState(selectedTask.is_internal)
  const commentContainerRef = React.useRef(null)

  React.useEffect(() => {
    if (commentContainerRef.current) {
      commentContainerRef.current.scrollTo(
        commentContainerRef.current.scrollHeight,
        commentContainerRef.current.scrollHeight
      )
    }
    return () => undefined
  }, [selectedTask])

  const handleClickTab = (value) => {
    if (activeTab === value) {
      setActiveTab('')
    } else setActiveTab(value)
  }

  const getCommentBasedOnType = (comment) => {
    switch (comment.comment_type) {
      case 'youtube_video':
        return <Iframe
          title={comment.id}
          src={`https://www.youtube.com/embed/${videoIdGenerator(comment.comment_content)}?rel=0`}
          type="text/html"
          frameBorder="0"
          allowFullScreen
        />
      case 'text/plain':
      case 'application/pdf':
      case 'application/zip':
      case 'file':
        return (
          <CommentLinkWrapper>
            <CommentLink href={comment.comment_content}
              target="_blank"
              rel="noopener noreferrer"
            >
              {comment.comment_content.split(/[\\/]/).pop()} {' '}
            </CommentLink>
            <FiDownload
              style={{ marginLeft: 5, cursor: 'pointer', color: '#272D3C' }}
              title="download file"
            />
          </CommentLinkWrapper>
        )
      case 'image/png':
      case 'image/jpeg':
      case 'image/gif':
      case 'image':
        return (
          <ImageContainer>
            <ImageContent
              style={{ width: 400, background: `url(${TransBack})` }}
              src={comment.comment_content}
              alt=""
              onClick={() => window.open(comment.comment_content, '_blank')}
              title='Open In New Tab'
            />
          </ImageContainer>
        )
      case 'link':
        return (
          <div
            variant="body2"
            className={ `
                            commentContent
                            ${comment.is_note && 'commentNoteLink'}
                            ${comment.is_deleted && 'commentDeleted'}`
            }
          >
            <div
              dangerouslySetInnerHTML={{ __html: comment?.comment_content }}
            ></div>
          </div>
        )
      case 'normal_text':
        return (
          <div
            variant="body2"
            className={ `
                            commentContent
                            ${comment.is_note && 'commentNote'}
                            ${comment.is_deleted && 'commentDeleted'}`
            }
          >
            <div
              dangerouslySetInnerHTML={{ __html: comment?.comment_content }}
            ></div>
          </div>
        )
    }
  }

  const handleChangeText = (e) => {
    setCommentText(e.target.value)
  }

  const startAddingComment = (note) => {
    setIsComment(true)
    const commentData = {
      task_id: selectedTask.id,
      wpf_user_id: wpUserId,
      wpf_site_id: selectedTask.site_id,
      comment_content: commentText,
      is_note: note
    }
    postData(commentApi, commentData).then(res => {
      if (res.status === 200) {
        setCommentText('')
        handleUpdateTaskComment(res.data)
      }
      setIsComment(false)
    })
  }
  const handleUploadFile = (e) => {
    const data = new FormData()
    data.append('file', e.target.files[0])
    data.append('task_id', selectedTask.id)
    data.append('task_notify_users', wpUserId)
    postUploadFile(uploadFileAPi, data).then(res => {
      if (res.status) {
        handleUpdateTaskComment(res.data)
        setIsComment(false)
      }
    })
  }

  const startInternalTask = () => {
    const commentData = {
      task_id: selectedTask.id,
      task_notify_users: wpUserId,
      internal: !isInternal,
      method:	'internal',
      from_wp: 1
    }
    postData(commentUpdateDetails, commentData).then(res => {
      if (res.status) {
        handleUpdateTaskComment(res.task, !isInternal, 'internal')
      }
    })
    setIsInternal(!isInternal)
  }

  return (
    <>
      <CommentWrapper>
        <div>
          <CommentHeader>
            <NavToolWrapper>
              <ToolButton onClick={handleClickTask}>
                <RxDoubleArrowLeft size={25} color={'#002157'}/>
              </ToolButton>
              <ToolButton activeTab={activeTab === 'user'} onClick={() => handleClickTab('user')}>
                <svg xmlns="http://www.w3.org/2000/svg" id="at-nav-user-tab" width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" className="task-content" id="at-nav-user-tab"></path><circle cx="9" cy="7" r="4" className="task-content" id="at-nav-user-tab"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87" className="task-content" id="at-nav-user-tab"></path><path d="M16 3.13a4 4 0 0 1 0 7.75" className="task-content" id="at-nav-user-tab"></path></svg>
              </ToolButton>
              <ToolButton activeTab={activeTab === 'status'} onClick={() => handleClickTab('status')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="at-nav-progress-tab"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" className="task-content" id="at-nav-progress-tab"></polyline></svg>
              </ToolButton>
              <ToolButton activeTab={activeTab === 'priority'} onClick={() => handleClickTab('priority')}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="at-nav-priority-tab" fill={'#002157'} stroke="currentColor" x="0px" y="0px" width="24" height="20" viewBox="155.622 86.813 200.754 200.134" enableBackground="new 155.622 86.813 200.754 200.134" ><path d="M354.368,148.18l-40.283-56.789c-2.031-2.864-5.343-4.575-8.854-4.576c-0.002,0-0.002,0-0.002,0c-3.514,0-6.824,1.71-8.857,4.576l-40.284,56.788c-2.36,3.326-2.663,7.644-0.791,11.268c1.872,3.624,5.569,5.875,9.648,5.875h16.781v110.34c0,6.223,5.062,11.285,11.286,11.285h24.431c6.224,0,11.286-5.063,11.286-11.285v-110.34h16.782c4.079,0,7.775-2.251,9.647-5.875C357.029,155.823,356.728,151.505,354.368,148.18z M321.232,150.33c-4.141,0-7.496,3.355-7.496,7.496v114.131h-17.02v-114.13c0-4.141-3.354-7.496-7.495-7.496h-16.28l32.285-45.514l32.286,45.514L321.232,150.33L321.232,150.33z" className="task-content at-cs-header-icons" id="at-nav-priority-tab"/><path d="M247.056,208.44h-16.782V98.099c0-6.224-5.062-11.286-11.286-11.286h-24.431c-6.224,0-11.286,5.062-11.286,11.286v40.943c0,4.141,3.355,7.496,7.496,7.496c4.141,0,7.496-3.355,7.496-7.496v-37.237h17.019v114.13c0,4.141,3.355,7.496,7.496,7.496h16.279l-32.285,45.513l-32.284-45.513h16.279c4.141,0,7.496-3.355,7.496-7.496v-42.03c0-4.141-3.355-7.496-7.496-7.496c-4.141,0-7.496,3.355-7.496,7.496v34.534h-16.781c-4.08,0-7.777,2.252-9.649,5.876s-1.567,7.942,0.792,11.265l40.284,56.789c2.033,2.866,5.344,4.578,8.857,4.578h0.002c3.514-0.002,6.824-1.714,8.854-4.578l40.283-56.787c2.36-3.325,2.665-7.643,0.792-11.267C254.832,210.691,251.135,208.44,247.056,208.44L247.056,208.44z" className="task-content at-cs-header-icons" id="at-nav-priority-tab"/></svg>
              </ToolButton>
              <ToolButton activeTab={activeTab === 'screenshot'} onClick={() => handleClickTab('screenshot')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="at-nav-screenshot-tab"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" className="task-content" id="at-nav-screenshot-tab"></path><circle cx="12" cy="13" r="4" className="task-content" id="at-nav-screenshot-tab"></circle></svg>
              </ToolButton>
              <ToolButton activeTab={activeTab === 'info'} onClick={() => handleClickTab('info')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="at-nav-additionalInfo-tab"><circle cx="12" cy="12" r="10" id="at-nav-additionalInfo-tab" className="task-content"></circle><line x1="12" y1="16" x2="12" y2="12" id="at-nav-additionalInfo-tab" className="task-content"></line><line x1="12" y1="8" x2="12.01" y2="8" id="at-nav-additionalInfo-tab" className="task-content"></line></svg>
              </ToolButton>
            </NavToolWrapper>
            <TaskNumber
              status = {selectedTask?.task_status}
            >
              <TaskUrgency
                priority = {selectedTask?.task_priority}
              ></TaskUrgency>
              {selectedTask?.task_comment_id}
            </TaskNumber>

          </CommentHeader>
          {
            activeTab === 'user' &&
            <TabWrapper>
              <UserTab
                notifyUser= {selectedTask.task_notify_users}
                taskId= {selectedTask.id}
                handleUpdateTaskComment= {handleUpdateTaskComment}
                wpUserId= {wpUserId}
              />
            </TabWrapper>
          }
          {
            activeTab === 'status' &&
            <TabWrapper status={true}>
              <StatusTab
                statusValue= {selectedTask?.task_status}
                taskId= {selectedTask.id}
                siteId= {selectedTask.site_id}
                handleUpdateTaskComment= {handleUpdateTaskComment}
                wpUserId= {wpUserId}
              />
            </TabWrapper>
          }
          {
            activeTab === 'priority' &&
            <TabWrapper>
              <PriorityTab
                priorityValue= {selectedTask?.task_priority}
                taskId= {selectedTask.id}
                siteId= {selectedTask.site_id}
                handleUpdateTaskComment= {handleUpdateTaskComment}
                wpUserId= {wpUserId}
              />
            </TabWrapper>
          }
          {
            activeTab === 'screenshot' &&
            <TabWrapper>
              <ScreenShotTab
                screenshot= {selectedTask?.wpf_task_screenshot}
              />
            </TabWrapper>
          }
          {
            activeTab === 'info' &&
            <TabWrapper>
              <AdditionalInfoTab
                screenSizeX = {selectedTask?.task_config_author_resX}
                screenSizeY = {selectedTask?.task_config_author_resY}
                browser = {selectedTask?.task_config_author_browser}
                createdBy = {selectedTask?.task_config_author_name}
                taskId = {selectedTask?.task_comment_id}
                siteName = {selectedTask?.site?.name}
                PageUrl = {selectedTask?.task_page_url}
                PageName = {selectedTask?.task_page_title}
              />
            </TabWrapper>
          }
        </div>
        <CommentsContainer ref={commentContainerRef}>
          {
            selectedTask.comments.map((comment, i) => (
              <Comment key={i} >
                {
                  comment.comment_type === 'task_update'
                    ? <CommentSec>
                      <FiBell
                        style={{
                          fontSize: 18,
                          marginRight: 5,
                          color: '#A4ABC5 '
                        }}
                      />
                      <CommentText
                        dangerouslySetInnerHTML={{ __html: comment?.comment_content }}
                      ></CommentText>
                      <CommentSentAt title={comment.comment_date}>{comment.comment_time}</CommentSentAt>
                    </CommentSec>
                    : <CommentNormal>
                      <AvatarTextWrapper>
                        <AvatarText>
                          {
                            `${comment?.wpf_author?.wpf_display_name.charAt(0).toUpperCase()}
                                            ${comment?.wpf_author?.wpf_display_name.charAt(1).toUpperCase()}`
                          }
                        </AvatarText>
                      </AvatarTextWrapper>
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginLeft: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <CommentSentBy>{comment.wpf_author.wpf_display_name}</CommentSentBy>
                            {
                              Boolean(comment.is_note) &&
                              <Chip>Note</Chip>
                            }
                          </div>
                          <div>
                            <CommentSentAt title='27-12-2022'>
                              {comment.comment_time}
                            </CommentSentAt>
                          </div>
                        </div>
                        <CommentContainer>
                          { getCommentBasedOnType(comment) }
                        </CommentContainer>
                      </div>
                    </CommentNormal>
                }
              </Comment>
            ))
          }
        </CommentsContainer>
        <CommentTextAreaWrapper>
          <CommentTextArea
            onChange={handleChangeText}
            value={commentText}
            placeholder="Add a comment..."
            autoFocus
          />
          <FileUploadWrapper>
            <InputFile
              type="file"
              name="file"
              onChange={handleUploadFile}
            />
            <FiPaperclip style={{ color: '#272D3C' }} size={20} />
          </FileUploadWrapper>
        </CommentTextAreaWrapper>
        <ActionWrapper>
          <CommentButton
            onClick={() => startAddingComment(false)}
            disabled={isCommenting}
          >Comment</CommentButton>
          <NoteButton
            onClick={() => startAddingComment(true)}
            disabled={isCommenting}

          >
            <FaRegStickyNote size="16px" />
          </NoteButton>
          <InternalButton
            isInternal= {isInternal}
          >
            <FiEyeOff size="20px"
              onClick={() => startInternalTask()}
            />
          </InternalButton>
        </ActionWrapper>
      </CommentWrapper>
    </>
  )
}
