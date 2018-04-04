import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

const hubCategories = vcCake.getService('hubCategories')
const workspaceStorage = vcCake.getStorage('workspace')
const cook = vcCake.getService('cook')

export default class EditFormHeader extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    options: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      content: props.element.cook().getName(),
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
    element.onChange(this.updateElementOnChange)
  }

  componentWillUnmount () {
    const { element } = this.props
    element.ignoreChange(this.updateElementOnChange)
  }

  updateElementOnChange () {
    const { element } = this.props
    let content = element.cook().getName()
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
    const { element, options } = this.props
    if (!value) {
      this.span.innerText = element.get('name')
    }

    if (options && options.child) {
      options.customUpdater(element, 'title', value)
    } else {
      element.customHeaderTitle = value
      // let elementData = elementsStorage.state(`element:${element.get('id')}`).get() || element.toJS()
      // elementData.customHeaderTitle = value
      // elementsStorage.trigger('update', elementData.id, elementData, 'editForm')
    }
    this.setState({
      editable: false
    })
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
    let { content, editable } = this.state
    let headerTitleClasses = classNames({
      'vcv-ui-edit-form-header-title': true,
      'active': editable
    })
    const backButton = options && options.child ? (
      <span className='vcv-ui-edit-form-back-button' onClick={this.goBack}>
        <i className='vcv-ui-icon vcv-ui-icon-chevron-left' /></span>) : null

    if (options && options.child && options.activeParamGroup) {
      content = options.activeParamGroup.title
    }

    const sectionImageSrc = hubCategories.getElementIcon(element.tag)
    const sectionImage = sectionImageSrc ? (
      <img src={sectionImageSrc} title={content} />) : null
    return (
      <div className='vcv-ui-edit-form-header'>
        {backButton}
        {sectionImage}
        <span className={headerTitleClasses}
          ref={span => { this.span = span }}
          contentEditable={editable}
          suppressContentEditableWarning
          onClick={this.enableEditable}
          onKeyDown={this.preventNewLine}
          onBlur={this.validateContent}
        >
          {content}
        </span>
        <i className='vcv-ui-icon vcv-ui-icon-edit vcv-ui-icon-edit-form-header-title'
          onClick={this.editTitle} />
      </div>
    )
  }
}
