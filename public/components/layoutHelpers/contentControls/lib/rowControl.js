import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import addElementIcon from 'public/sources/images/blankRowPlaceholderIcons/addElement.raw'

const layoutStorage = getStorage('layout')
const cook = getService('cook')

export default class RowControl extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.state = {
      iconPosition: {}
    }
    this.handleInteractWithContent = this.handleInteractWithContent.bind(this)
    this.icon = React.createRef()
    this.container = React.createRef()
  }

  componentDidMount () {
    layoutStorage.state('interactWithContent').onChange(this.handleInteractWithContent)
  }

  componentWillUnmount () {
    layoutStorage.state('interactWithContent').ignoreChange(this.handleInteractWithContent)
  }

  handleInteractWithContent (data) {
    const isHelperVisible = this.isElementInViewport(this.icon.current)
    if (data.type === 'mouseEnter' && !isHelperVisible) {
      const currentElement = cook.getById(data.vcElementId)
      const currentElementTag = currentElement.get('tag')
      if (currentElementTag === 'column' || currentElementTag === 'row') {
        const closestRowId = currentElementTag === 'row' ? data.vcElementId : data.vcElementsPath[1]
        if (this.icon.current.closest(`#el-${closestRowId}`)) {
          const newState = {
            position: 'absolute'
          }
          const containerRect = this.container.current.getBoundingClientRect()
          const iconRect = this.icon.current.getBoundingClientRect()
          if (containerRect.top < 0 && containerRect.bottom > 0) {
            newState.bottom = `${(containerRect.bottom / 2) - (iconRect.height / 2)}px`
          } else if (containerRect.bottom > window.innerHeight && containerRect.top < window.innerHeight) {
            newState.top = `${((window.innerHeight - containerRect.top) / 2) - (iconRect.height / 2)}px`
          }
          this.setState({ iconPosition: newState })
        }
      }
    } else if (data.type === 'mouseLeave' && isHelperVisible) {
      if (Object.keys(this.state.iconPosition).length) {
        // CSS animation to hide the icon is 0.2s, thus needs a timeout to remove styles
        const timeout = setTimeout(() => {
          this.setState({ iconPosition: {} })
          clearTimeout(timeout)
        }, 200)
      }
    }
  }

  isElementInViewport (el) {
    const rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  render () {
    const svgClasses = classNames({
      'vcv-ui-blank-row-element-control-icon': true
    })

    return (
      <span
        className='vcv-ui-blank-row-element-control'
        ref={this.container}
      >
        <span
          className={svgClasses}
          dangerouslySetInnerHTML={{ __html: addElementIcon }}
          title={RowControl.localizations ? RowControl.localizations.addElement : 'Add Element'}
          ref={this.icon}
          style={this.state.iconPosition}
        />
        <span className='vcv-ui-blank-row-element-control-label'>Add Element</span>
      </span>
    )
  }
}
