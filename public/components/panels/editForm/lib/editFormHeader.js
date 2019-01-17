import React from 'react'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import PropTypes from 'prop-types'

const hubCategories = getService('hubCategories')
const workspaceStorage = getStorage('workspace')
const cook = getService('cook')
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
    let cookElement = elementAccessPoint.cook()
    let content = cookElement.getName()
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
    let range = document.createRange()
    let selection = window.getSelection()
    range.selectNodeContents(this.span)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  updateContent (value) {
    const { elementAccessPoint } = this.props
    if (!value) {
      // TODO: Correct name
      //let tempelement = element.services.cook.get({ tag: element.get('id').tag })
      //this.span.innerText = tempelement.get('name')
     // this.span.innerText = elementAccessPoint.get('name')
    }
    // elementAccessPoint.customHeaderTitle = value // TODO: SET
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
    let { parentElementAccessPoint, options } = this.props.options
    workspaceStorage.trigger('edit', parentElementAccessPoint.id, parentElementAccessPoint.tag, options)
  }

  render () {
    const { elementAccessPoint, options } = this.props
    let { content, editable } = this.state
    console.log(options)
    debugger;
    let isNested = options && (options.child || options.nestedAttr)
    let headerTitleClasses = classNames({
      'vcv-ui-edit-form-header-title': true,
      'active': editable
    })
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const backToParentTitle = localizations ? localizations.backToParent : 'Back to parent'
    const backButton = isNested ? (
      <span className='vcv-ui-edit-form-back-button' onClick={this.goBack} title={backToParentTitle}>
        <i className='vcv-ui-icon vcv-ui-icon-chevron-left' /></span>) : null

    if (isNested && options.activeParamGroup) {
      content = options.activeParamGroup.title
    }

    const sectionImageSrc = hubCategories.getElementIcon(elementAccessPoint.tag)
    const sectionImage = sectionImageSrc ? (
      <img className='vcv-ui-edit-form-header-image' src={sectionImageSrc} title={content} />) : null

    let headerTitle = isNested && options.activeParamGroup
      ? (<span className={headerTitleClasses}
        ref={span => { this.span = span }}
      >
        {content}
      </span>)
      : (<span className={headerTitleClasses}
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
