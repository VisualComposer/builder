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

    this.handleClickEnableEditable = this.handleClickEnableEditable.bind(this)
    this.handleBlurValidateContent = this.handleBlurValidateContent.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.handleKeyDownPreventNewLine = this.handleKeyDownPreventNewLine.bind(this)
    this.updateElementOnChange = this.updateElementOnChange.bind(this)
    this.handleClickGoBack = this.handleClickGoBack.bind(this)
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

  handleClickEnableEditable () {
    this.setState({
      editable: true
    }, () => {
      this.span.focus()
    })
  }

  editTitle () {
    this.handleClickEnableEditable()
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

  handleBlurValidateContent () {
    const value = this.span.innerText.trim()
    this.updateContent(value)
  }

  handleKeyDownPreventNewLine (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this.span.blur()
      this.handleBlurValidateContent()
    }
  }

  handleClickGoBack () {
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
    let backButton = null
    if (isNested) {
      backButton = (
        <span className='vcv-ui-edit-form-back-button' onClick={this.handleClickGoBack} title={backToParentTitle}>
          <i className='vcv-ui-icon vcv-ui-icon-chevron-left' />
        </span>
      )
    }

    if (isNested && options.activeParamGroupTitle) {
      content = options.activeParamGroupTitle
    }

    const sectionImageSrc = hubCategories.getElementIcon(elementAccessPoint.tag)
    let sectionImage = null
    if (sectionImageSrc) {
      sectionImage = <img className='vcv-ui-edit-form-header-image' src={sectionImageSrc} title={content} />
    }

    let headerTitle
    if (isNested && options.activeParamGroup) {
      headerTitle = <span className={headerTitleClasses} ref={span => { this.span = span }}>{content}</span>
    } else {
      headerTitle = (
        <span
          className={headerTitleClasses}
          ref={span => { this.span = span }}
          contentEditable={editable}
          suppressContentEditableWarning
          onClick={this.handleClickEnableEditable}
          onKeyDown={this.handleKeyDownPreventNewLine}
          onBlur={this.handleBlurValidateContent}
        >
          {content}
        </span>
      )
    }

    return (
      <div className='vcv-ui-edit-form-header'>
        {backButton}
        {sectionImage}
        {headerTitle}
      </div>
    )
  }
}
