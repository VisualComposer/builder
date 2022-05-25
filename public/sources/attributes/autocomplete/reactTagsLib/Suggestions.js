import React from 'react'
import { matchAny } from './concerns/matchers'
import Scrollbar from 'public/components/scrollbar/scrollbar'

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

  componentDidUpdate (prevProps) {
    if (prevProps.index !== this.props.index) {
      const activeItem = this.suggestionBox.current.querySelector('.vc-tags--suggestion.is-active')
      const scrollContainer = this.suggestionBox.current.querySelector('.vcv-ui-scroll-content')
      if (!activeItem || !scrollContainer) {
        return
      }
      const activeItemRect = activeItem.getBoundingClientRect()
      const scrollContainerRect = scrollContainer.getBoundingClientRect()

      if (scrollContainer.scrollTop + scrollContainerRect.height < activeItem.offsetTop + activeItemRect.height) {
        scrollContainer.scrollTop -= (scrollContainer.scrollTop + scrollContainerRect.height) - (activeItem.offsetTop + activeItemRect.height)
      } else if (scrollContainer.scrollTop > activeItem.offsetTop) {
        scrollContainer.scrollTop -= scrollContainer.scrollTop - activeItem.offsetTop
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
      const classNames = ['vc-tags--suggestion']

      if (this.props.index === index) {
        classNames.push(this.props.classNames.suggestionActive)
      }

      if (item.disabled) {
        classNames.push(this.props.classNames.suggestionDisabled)
      }

      return (
        <div
          id={key}
          key={key}
          className={classNames.join(' ')}
          aria-disabled={item.disabled === true}
          onMouseDown={this.onMouseDown.bind(this, item)}
        >
          {item.prefix ? <span className={this.props.classNames.suggestionPrefix}>{item.prefix}</span> : null}
          {(item.disableMarkIt || this.props.disableMarkIt) ? item.name
            : <SuggestionComponent item={item} query={this.props.query} />}
        </div>
      )
    })

    let classes = this.props.classNames.suggestions
    if (this.state.showAtTop) {
      classes += ` ${this.props.classNames.suggestions}--top`
    }

    return (
      <div className={classes} ref={this.suggestionBox}>
        <Scrollbar id={this.props.id}>{options}</Scrollbar>
      </div>
    )
  }
}

export default Suggestions
