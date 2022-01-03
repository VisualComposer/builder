import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')

export default class ElementControl extends React.Component {
  static propTypes = {
    control: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleCopyStateChange = this.handleCopyStateChange.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
    this.state = {
      isDisabled: false
    }
  }

  componentDidMount () {
    if (this.props.control.tag === 'paste') {
      let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || workspaceStorage.state('copyData').get()
      if (typeof copyData === 'string') {
        copyData = JSON.parse(copyData)
      }
      this.setDisabledState(copyData)

      workspaceStorage.state('copyData').onChange(this.handleCopyStateChange)
      settingsStorage.state('layoutType').onChange(this.handleLayoutChange)
      window.addEventListener('storage', this.handleCopyStateChange)
    }
  }

  componentWillUnmount () {
    if (this.props.control.tag === 'paste') {
      workspaceStorage.state('copyData').ignoreChange(this.handleCopyStateChange)
      settingsStorage.state('layoutType').ignoreChange(this.handleLayoutChange)
      window.removeEventListener('storage', this.handleCopyStateChange)
    }
  }

  setDisabledState (copyData) {
    const editorType = dataManager.get('editorType')
    const layoutType = settingsStorage.state('layoutType').get()
    const copyOptions = copyData.options
    const isEditorRelatedElement =
      copyData &&
      copyOptions.editorTypeRelation &&
      copyOptions.editorTypeRelation === 'vcv_layouts' &&
      (editorType !== 'vcv_layouts' ||
        (
          (layoutType === 'archiveTemplate' && copyOptions.elementTag === 'layoutContentArea') ||
          (layoutType === 'postTemplate' && copyOptions.elementTag === 'postsGridDataSourceArchive')
        )
      )

    if (isEditorRelatedElement && !this.state.isDisabled) {
      this.setState({ isDisabled: true })
    } else if (!isEditorRelatedElement && this.state.isDisabled) {
      this.setState({ isDisabled: false })
    }
  }

  handleCopyStateChange (data) {
    if (data.key === 'vcv-copy-data' || (data.options && data.element)) {
      const copyData = data.key === 'vcv-copy-data' ? JSON.parse(data.newValue) : data
      this.setDisabledState(copyData)
    }
  }

  handleLayoutChange () {
    let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || workspaceStorage.state('copyData').get()
    if (typeof copyData === 'string') {
      copyData = JSON.parse(copyData)
    }
    this.setDisabledState(copyData)
  }

  handleClick (e) {
    e && e.preventDefault()
    if (!this.state.isDisabled) {
      this.props.handleClick(this.props.control)
    }
  }

  render () {
    const { options } = this.props.control
    const classes = classNames({
      'vcv-ui-blank-row-element-control': true,
      'vcv-ui-blank-row-element-control--disabled': this.props.control.tag === 'paste' && this.state.isDisabled
    })

    return (
      <span
        className={classes}
        title={options.title}
        onClick={this.handleClick}
      >
        <span
          className='vcv-ui-blank-row-element-control-icon'
          dangerouslySetInnerHTML={{ __html: options.icon }}
          alt={options.title}
        />
        <span className='vcv-ui-blank-row-element-control-label'>{options.title}</span>
      </span>
    )
  }
}
