import React from 'react'
import classNames from 'classnames'
import EditFormContent from './editFormContent'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const hubCategories = vcCake.getService('hubCategories')
const elementsStorage = vcCake.getStorage('elements')
const cook = vcCake.getService('cook')

export default class EditForm extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    options: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      content: props.element.getName(),
      editable: false
    }

    this.enableEditable = this.enableEditable.bind(this)
    this.validateContent = this.validateContent.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.preventNewLine = this.preventNewLine.bind(this)
    this.updateElementOnChange = this.updateElementOnChange.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount () {
    const { element } = this.props
    const id = element.get('id')
    if (vcCake.env('TF_RENDER_PERFORMANCE')) {
      elementsStorage.on(`element:${id}`, this.updateElementOnChange)
    } else {
      elementsStorage.state(`element:${id}`).onChange(this.updateElementOnChange)
    }
  }

  componentWillUnmount () {
    const { element } = this.props
    const id = element.get('id')
    if (vcCake.env('TF_RENDER_PERFORMANCE')) {
      elementsStorage.off(`element:${id}`, this.updateElementOnChange)
    } else {
      elementsStorage.state(`element:${id}`).ignoreChange(this.updateElementOnChange)
    }
  }

  updateElementOnChange (data, source) {
    if (vcCake.env('TF_RENDER_PERFORMANCE') && source === 'editForm') {
      return
    }
    const element = cook.get(data)
    let content = element.getName()
    if (this.state.content !== content) {
      this.setState({
        content
      }, () => {
        this.span.innerText = content
      })
    }
  }

  enableEditable () {
    this.setState({
      editable: true
    }, () => {
      this.span.focus()
    })
  }

  editTitle () {
    this.enableEditable()
    let range = document.createRange()
    let selection = window.getSelection()
    range.selectNodeContents(this.span)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  updateContent (value) {
    const { element } = this.props

    // element.set('customHeaderTitle', value)
    // let elementData = element.toJS()
    if (this.props.options && this.props.options.child) {
      this.props.options.customUpdater(element, 'title', value)
    } else {
      let elementData = elementsStorage.state(`element:${element.get('id')}`).get() || element.toJS()
      elementData.customHeaderTitle = value
      elementsStorage.trigger('update', elementData.id, elementData, 'editForm')
    }
    this.setState({
      editable: false
    })
    if (!value) {
      this.span.innerText = element.get('name')
    }
  }

  validateContent () {
    let value = this.span.innerText.trim()
    this.updateContent(value)
  }

  preventNewLine (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this.span.blur()
      this.validateContent()
    }
  }

  goBack () {
    let { parentElement, parentElementOptions } = this.props.options
    let element = cook.get(parentElement)
    parentElementOptions.element = parentElement
    workspaceStorage.trigger('edit', element.get('id'), element.get('tag'), parentElementOptions)
  }

  render () {
    const { element, options } = this.props
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    let { content, editable } = this.state

    let headerTitleClasses = classNames({
      'vcv-ui-edit-form-header-title': true,
      'active': this.state.editable
    })

    const backButton = options && options.child ? (
      <span className='vcv-ui-edit-form-back-button' onClick={this.goBack}>
        <i className='vcv-ui-icon vcv-ui-icon-chevron-left' /></span>) : null

    if (options && options.child && options.activeParamGroup) {
      content = options.activeParamGroup.title
    }

    const sectionImageSrc = hubCategories.getElementIcon(element.get('tag'))
    const sectionImage = sectionImageSrc ? (
      <img src={sectionImageSrc} title={element.get('name')} />) : null

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content-accordion'>
        <div className='vcv-ui-edit-form-header'>
          {backButton}
          {sectionImage}
          <span className={headerTitleClasses}
            ref={span => { this.span = span }}
            contentEditable={editable}
            suppressContentEditableWarning
            onClick={this.enableEditable}
            onKeyDown={this.preventNewLine}
            onBlur={this.validateContent}>
            {content}
          </span>
          <i className='vcv-ui-icon vcv-ui-icon-edit vcv-ui-icon-edit-form-header-title'
            onClick={this.editTitle} />
        </div>
        <div className={treeContentClasses}>
          <EditFormContent {...this.props} />
        </div>
      </div>
    )
  }
}
