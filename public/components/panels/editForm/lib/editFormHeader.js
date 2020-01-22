import React from 'react'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import PropTypes from 'prop-types'

const hubCategories = getService('hubCategories')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')

export default class EditFormHeader extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    options: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      content: props.elementAccessPoint.cook().getName(),
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
    const { elementAccessPoint } = this.props
    elementAccessPoint.onChange(this.updateElementOnChange)
  }

  componentWillUnmount () {
    const { elementAccessPoint } = this.props
    elementAccessPoint.ignoreChange(this.updateElementOnChange)
  }

  updateElementOnChange () {
    const { elementAccessPoint } = this.props
    const cookElement = elementAccessPoint.cook()
    const content = cookElement.getName()
    // Check element name field
    if (this.state.content !== content) {
      this.setState({
        content
      }, () => {
        this.span.innerText = content
      })
    }

    // Trigger attributes events
    const publicKeys = cookElement.filter((key, value, settings) => {
      return settings.access === 'public'
    })
    publicKeys.forEach((key) => {
      const newValue = cookElement.get(key)
      elementsStorage.trigger(`element:${cookElement.get('id')}:attribute:${key}`, newValue, cookElement)
    })
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
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(this.span)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  updateContent (value) {
    const { elementAccessPoint } = this.props
    if (!value) {
      this.span.innerText = elementAccessPoint.cook().getName()
    }
    elementAccessPoint.set('customHeaderTitle', value)
    this.setState({
      editable: false
    })
  }

  validateContent () {
    const value = this.span.innerText.trim()
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
    let { parentElementAccessPoint: accessPoint, options } = this.props.options
    // If multiple nesting used we can goBack only to ROOT
    while (accessPoint.inner) {
      if (accessPoint.parentElementAccessPoint) {
        accessPoint = accessPoint.parentElementAccessPoint
      } else {
        break
      }
    }
    workspaceStorage.trigger('edit', accessPoint.id, accessPoint.tag, options)
  }

  render () {
    const { elementAccessPoint, options } = this.props
    let { content, editable } = this.state
    const isNested = options && (options.child || options.nestedAttr)
    const headerTitleClasses = classNames({
      'vcv-ui-edit-form-header-title': true,
      active: editable
    })
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const backToParentTitle = localizations ? localizations.backToParent : 'Back to parent'
    const backButton = isNested ? (
      <span className='vcv-ui-edit-form-back-button' onClick={this.goBack} title={backToParentTitle}>
        <i className='vcv-ui-icon vcv-ui-icon-chevron-left' />
      </span>) : null

    if (isNested && options.activeParamGroupTitle) {
      content = options.activeParamGroupTitle
    }

    const sectionImageSrc = hubCategories.getElementIcon(elementAccessPoint.tag)
    const sectionImage = sectionImageSrc ? (
      <img className='vcv-ui-edit-form-header-image' src={sectionImageSrc} title={content} />) : null

    const headerTitle = isNested && options.activeParamGroup
      ? (<span
        className={headerTitleClasses}
        ref={span => { this.span = span }}
      >
        {content}
      </span>)
      : (<span
        className={headerTitleClasses}
        ref={span => { this.span = span }}
        contentEditable={editable}
        suppressContentEditableWarning
        onClick={this.enableEditable}
        onKeyDown={this.preventNewLine}
        onBlur={this.validateContent}
      >
        {content}
      </span>)

    return (
      <div className='vcv-ui-edit-form-header'>
        {backButton}
        {sectionImage}
        {headerTitle}
      </div>
    )
  }
}
