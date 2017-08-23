import React from 'react'
import classNames from 'classnames'
import EditFormTabsOutput from './editFormTabsOutput.js'
import EditFormContent from './editFormContent'
import vcCake from 'vc-cake'

const hubCategories = vcCake.getService('hubCategories')
const elementsStorage = vcCake.getStorage('elements')

export default class EditForm extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      content: props.element.get('customHeaderTitle') || props.element.get('name'),
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
    const id = element.get('id')
    elementsStorage.state(`element:${id}`).onChange(this.updateElementOnChange)
  }

  componentWillUnmount () {
    const { element } = this.props
    const id = element.get('id')
    elementsStorage.state(`element:${id}`).ignoreChange(this.updateElementOnChange)
  }

  updateElementOnChange (data) {
    if (data && data.hasOwnProperty('customHeaderTitle')) {
      let content = data.customHeaderTitle || data.name
      if (this.state.content !== content) {
        this.setState({
          content
        }, () => {
          this.span.innerText = content
        })
      }
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
    element.set('customHeaderTitle', value)
    let elementData = element.toJS()
    elementsStorage.trigger('update', elementData.id, elementData, 'editFormTitle')
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

    let envContent = (
      <div className='vcv-ui-edit-form-header'>
        <img src={hubCategories.getElementIcon(element.get('tag'))} title={element.get('name')} />
        <span className={headerTitleClasses}>
          {element.get('name')}
        </span>
      </div>
    )

    if (vcCake.env('FEATURE_RENAME_ELEMENT')) {
      envContent = (
        <div className='vcv-ui-edit-form-header'>
          <img src={hubCategories.getElementIcon(element.get('tag'))} title={element.get('name')} />
          <span className={headerTitleClasses}
            ref={span => { this.span = span }}
            contentEditable={editable}
            suppressContentEditableWarning
            onClick={this.enableEditable}
            onKeyDown={this.preventNewLine}
            onBlur={this.validateContent}>
            {content}
          </span>
          <i className='vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-edit vcv-ui-icon-edit-form-header-title'
            onClick={this.editTitle} />
        </div>
      )
    }

    if (vcCake.env('EDIT_FORM_ACCORDION')) {
      return (
        <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content-accordion'>
          {envContent}
          <div className={treeContentClasses}>
            <EditFormContent {...this.props} />
          </div>
        </div>
      )
    }

    return (
      <div className='vcv-ui-tree-view-content'>
        <div className={treeContentClasses}>
          <EditFormTabsOutput {...this.props} />
          <EditFormContent {...this.props} />
        </div>
      </div>
    )
  }
}
