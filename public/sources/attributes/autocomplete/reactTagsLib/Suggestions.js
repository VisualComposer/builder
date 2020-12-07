import React from 'react'
import { matchAny } from './concerns/matchers'

function markIt (name, query) {
  const regexp = matchAny(query)
  return name.replace(regexp, '<mark>$&</mark>')
}

const DefaultSuggestionComponent = ({ item, query }) => (
  <span dangerouslySetInnerHTML={{ __html: markIt(item.name, query) }} />
)

class Suggestions extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showAtTop: false
    }
    this.suggestionBox = React.createRef()
  }

  componentDidMount () {
    if (this.suggestionBox && this.suggestionBox.current) {
      const suggestionRect = this.suggestionBox.current.getBoundingClientRect()
      const bodyRect = window.document.body.getBoundingClientRect()

      if (suggestionRect.bottom > bodyRect.height) {
        this.setState({ showAtTop: true })
      }
    }
  }

  onMouseDown (item, e) {
    // focus is shifted on mouse down but calling preventDefault prevents this
    e.preventDefault()
    this.props.addTag(item)
  }

  render () {
    const SuggestionComponent = this.props.suggestionComponent || DefaultSuggestionComponent

    const options = this.props.options.map((item, index) => {
      const key = `${this.props.id}-${index}`
      const classNames = []

      if (this.props.index === index) {
        classNames.push(this.props.classNames.suggestionActive)
      }

      if (item.disabled) {
        classNames.push(this.props.classNames.suggestionDisabled)
      }

      return (
        <li
          id={key}
          key={key}
          role='option'
          className={classNames.join(' ')}
          aria-disabled={item.disabled === true}
          onMouseDown={this.onMouseDown.bind(this, item)}
        >
          {item.prefix ? <span className={this.props.classNames.suggestionPrefix}>{item.prefix}</span> : null}
          {(item.disableMarkIt || this.props.disableMarkIt) ? item.name
            : <SuggestionComponent item={item} query={this.props.query} />}
        </li>
      )
    })

    let classes = this.props.classNames.suggestions
    if (this.state.showAtTop) {
      classes += ` ${this.props.classNames.suggestions}--top`
    }

    return (
      <div className={classes} ref={this.suggestionBox}>
        <ul role='listbox' id={this.props.id}>{options}</ul>
      </div>
    )
  }
}

export default Suggestions
