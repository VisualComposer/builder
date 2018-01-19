import React from 'react'
import classNames from 'classnames'
import EditFormContent from './editFormContent'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

const hubCategories = vcCake.getService('hubCategories')

export default class EditForm extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired
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
    const { element } = this.props
    this.setState({
      editable: false
    })
    if (!value) {
      this.span.innerText = element.get('name')
    }
    element.customHeaderTitle = value
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

  render () {
    const { element } = this.props
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    let { content, editable } = this.state

    let headerTitleClasses = classNames({
      'vcv-ui-edit-form-header-title': true,
      'active': this.state.editable
    })

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content-accordion'>
        <div className='vcv-ui-edit-form-header'>
          <img src={hubCategories.getElementIcon(element.tag)} title={content} />
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
