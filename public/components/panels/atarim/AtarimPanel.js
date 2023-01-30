/* eslint-disable */
import React from 'react'
import { getData } from './services/apiResquest'
import Sidebar from './SideBar'
import './style/sidebar.css'
import TaskContent from './TaskContent'
import Scrollbar from 'public/components/scrollbar/scrollbar'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'

const workspaceContentState = getStorage('workspace').state('content')
const localizations = getService('dataManager').get('localizations')

export default class AtarimPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSelectTask: false,
      taskData: {},
      taskList: [],
      selectedTask: null,
      isLoadingTask: false,
      wpUserId: null,
      isVisible: workspaceContentState.get() === 'atarim'
    }

    this.setVisibility = this.setVisibility.bind(this)
  }

  async componentDidMount () {
    workspaceContentState.onChange(this.setVisibility)

    this.getCookie('wpf_manage_ip')

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    })
    const pageId = params.post
    const base_url = window.location.origin
    this.setState({
      isLoadingTask: true
    })
    await getData(`${base_url}/wp-json/atarim/v1/db/vc`).then(res => {
      if (res?.wpf_site_id) {
        getData(`https://apiv3.wpfeedback.co/vc/all/task/?wpf_site_id=${res?.wpf_site_id}&current_page_id=${pageId}`)
          .then(data => {
            this.setState({
              taskData: data,
              taskList: data.data
            })
          })
      }
    }).finally(() => {
      this.setState({
        isLoadingTask: false
      })
    })
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'atarim'
    })
  }

  getCookie (name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return this.setState({
        wpUserId: parts.pop().split(';').shift()
      })
    }
  }

  handleClickTask = (taskValue) => {
    this.setState({
      isSelectTask: !this.state.isSelectTask,
      selectedTask: taskValue
    })
  }

  handleSetSearchedTask = (data) => {
    this.setState({
      taskList: data
    })
  }

  handleUpdateTaskComment = (data, taskUpate, type) => {
    const newComment = this.state.selectedTask.task.comments.concat(data)
    const commentUpdate = this.state.taskList.map(each => each.task.id === data.task_id
      ? { ...each, task: { ...each.task, comments: newComment } } : each
    )
    this.setState({
      selectedTask: { task: { ...this.state.selectedTask.task, comments: newComment } },
      taskList: commentUpdate
    })
    if (taskUpate) {
      if (type === 'status') {
        const newStatus = this.state.taskList.map(each => each.task.id === data.task_id
          ? { ...each, task: { ...each.task, task_status: taskUpate, comments: newComment } } : each
        )
        this.setState({
          selectedTask: { task: { ...this.state.selectedTask.task, task_status: taskUpate, comments: newComment } },
          taskList: newStatus
        })
      } else if (type === 'priority') {
        const newPriority = this.state.taskList.map(each => each.task.id === data.task_id
          ? { ...each, task: { ...each.task, task_priority: taskUpate, comments: newComment } } : each
        )
        this.setState({
          selectedTask: { task: { ...this.state.selectedTask.task, task_priority: taskUpate, comments: newComment } },
          taskList: newPriority
        })
      } else if (type === 'internal') {
        this.setState({
          selectedTask: { task: { ...this.state.selectedTask.task, is_internal: taskUpate, comments: newComment } }
        })
      }
    }
  }

  render () {
    const title = localizations ? localizations.atarimPanelTitle : 'Collaboration Tasks & Feedback'

    const panelClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-tree-view-content-accordion': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })
    return (

      <div className={panelClasses}>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-atarim-comments' />
          <span className='vcv-ui-panel-heading-text'>
            {title}
          </span>
        </div>

        <div className='vcv-ui-tree-content'>
          <div className='vcv-ui-tree-content-section'>
            <Scrollbar >
              <div className='vcv-ui-tree-content-section-inner'>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='atarimWrapper'>
                      {
                        this.state.isSelectTask
                          ? <TaskContent
                            isSelectTask = {this.state.isSelectTask}
                            handleClickTask= {this.handleClickTask}
                            selectedTask= {this.state.selectedTask.task}
                            handleStartPost= {this.handleStartPost}
                            handleUpdateTaskComment= {this.handleUpdateTaskComment}
                            wpUserId= {this.state.wpUserId}
                          />
                          : <Sidebar
                            isSelectTask = {this.state.isSelectTask}
                            handleClickTask= {this.handleClickTask}
                            taskList= {this.state.taskList || []}
                            taskData= {this.state.taskData}
                            handleSetSearchedTask= {this.handleSetSearchedTask}
                            isLoadingTask= {this.state.isLoadingTask}
                          />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      </div>

    )
  }
}
