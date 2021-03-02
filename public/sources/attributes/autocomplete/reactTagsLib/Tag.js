import React from 'react'
import classNames from 'classnames'

export default class Tag extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isTagEditable: false
    }

    this.handleKeyDownPreventNewLine = this.handleKeyDownPreventNewLine.bind(this)
    this.handleTagClick = this.handleTagClick.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleTagClick () {
    this.setState({
      isTagEditable: true
    })
  }

  handleBlur (event) {
    this.setState({
      isTagEditable: false
    })

    this.props.onTagChange(event.currentTarget.innerHTML)
  }

  handleKeyDownPreventNewLine (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.span && this.span.blur()
      this.handleBlur(event)
    }
  }

  render () {
    const tagClasses = classNames({
      [this.props.classNames.selectedTag]: true,
      'vc-tags--selected-tag--editable': this.state.isTagEditable,
      'vc-tags--tag-not-valid': !this.props.valid
    })

    return (
      <>
        <div
          className={tagClasses}
        >
          <span
            contentEditable={this.props.isTagEditable && this.state.isTagEditable}
            suppressContentEditableWarning
            className={this.props.classNames.selectedTagName}
            onClick={this.props.isTagEditable && this.handleTagClick}
            onBlur={this.props.isTagEditable && this.handleBlur}
            onKeyDown={this.props.isTagEditable && this.handleKeyDownPreventNewLine}
          >
            {this.props.tag.name}
          </span>
          <i
            className='vcv-ui-icon vcv-ui-icon-close-thin'
            onClick={this.props.onDelete}
            title={this.props.removeButtonText}
          />
        </div>
      </>
    )
  }
}
