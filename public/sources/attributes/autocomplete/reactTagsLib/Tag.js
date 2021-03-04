import React from 'react'
import classNames from 'classnames'
import Suggestions from './Suggestions'

export default class Tag extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isTagEditable: false
    }

    this.handleKeyDownPreventNewLine = this.handleKeyDownPreventNewLine.bind(this)
    this.onSuggestionClick = this.onSuggestionClick.bind(this)
    this.handleTagClick = this.handleTagClick.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleTagClick () {
    this.setState({
      isTagEditable: true
    }, () => {
      this.span.focus()
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
      this.handleBlur(event)
    }
  }

  onSuggestionClick (suggestion) {
    this.props.onTagChange(suggestion.name)
  }

  render () {
    const tagClasses = classNames({
      [this.props.classNames.selectedTag]: true,
      'vc-tags--selected-tag--editable': this.state.isTagEditable,
      'vc-tags--tag-not-valid': !this.props.valid
    })

    let suggestionComponent = null
    if (this.state.isTagEditable) {
      suggestionComponent = (
        <Suggestions
          {...this.props.tagsState}
          id={this.props.id}
          ref={this.props.suggestions}
          classNames={this.props.classNames}
          addTag={this.onSuggestionClick}
          disableMarkIt={this.props.disableMarkIt}
          suggestionComponent={this.props.suggestionComponent}
        />
      )
    }

    return (
      <div className={tagClasses}>
        <span
          contentEditable={this.props.isTagEditable && this.state.isTagEditable}
          suppressContentEditableWarning
          className={this.props.classNames.selectedTagName}
          onClick={this.props.isTagEditable && this.handleTagClick}
          onBlur={this.props.isTagEditable && this.handleBlur}
          onKeyDown={this.props.isTagEditable && this.handleKeyDownPreventNewLine}
          ref={span => { this.span = span }}
        >
          {this.props.tag.name}
        </span>
        <i
          className='vcv-ui-icon vcv-ui-icon-close-thin'
          onClick={this.props.onDelete}
          title={this.props.removeButtonText}
        />
        {suggestionComponent}
      </div>
    )
  }
}
