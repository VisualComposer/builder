import React from 'react'
import ReactTags from './ReactTags'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const removeText = localizations ? localizations.remove : 'Remove'

function suggestionsFilter () {
  return true
}

export default class ReactTagContainer extends React.Component {
  constructor (props) {
    super(props)

    this.reactTags = React.createRef()

    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
  }

  handleDelete (i) {
    const tags = this.props.value.slice(0)
    tags.splice(i, 1)
    this.props.onChange(tags)
  }

  handleAddition (tag) {
    const tags = [].concat(this.props.value, tag)
    this.props.onChange(tags)
  }

  render () {
    return (
      <ReactTags
        ref={this.reactTags}
        tags={this.props.value}
        suggestions={this.props.suggestions}
        onDelete={this.handleDelete}
        onAddition={this.handleAddition}
        onInput={this.props.handleInputChange}
        suggestionsFilter={suggestionsFilter}
        removeButtonText={removeText}
      />
    )
  }
}
