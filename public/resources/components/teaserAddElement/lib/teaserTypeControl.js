import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const controls = [
  {
    type: 'all',
    name: 'All'
  },
  {
    type: 'element',
    name: 'Elements'
  },
  {
    type: 'template',
    name: 'Templates'
  },
  {
    type: 'header',
    name: 'Header'
  },
  {
    type: 'footer',
    name: 'Footer'
  },
  {
    type: 'sidebar',
    name: 'Sidebar'
  }
]

export default class TeaserTypeControl extends React.Component {
  static propTypes = {
    filterType: PropTypes.string.isRequired,
    setFilterType: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      totalControlWidth: 0,
      isControlsHidden: true
    }
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount () {
    this.setState({ totalControlWidth: this.getControlsTotalWidth() })
    this.handleResize()
    const contentEndObject = document.querySelector('#vcv-editor-end object')
    contentEndObject.contentDocument.defaultView.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    const contentEndObject = document.querySelector('#vcv-editor-end object')
    contentEndObject.contentDocument.defaultView.removeEventListener('resize', this.handleResize)
  }

  getControlsTotalWidth () {
    const controls = Array.from(ReactDOM.findDOMNode(this).children)
    let totalWidth = 0
    controls.forEach((control) => {
      totalWidth += control.getBoundingClientRect().width
    })
    return totalWidth
  }

  handleResize () {
    const wrapperWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width
    const { isControlsHidden, totalControlWidth } = this.state
    let controlsWidth = totalControlWidth || this.getControlsTotalWidth()
    // console.log('controlsWidth', controlsWidth)
    // console.log('totalControlWidth', totalControlWidth)
    // console.log('wrapperWidth', wrapperWidth)
    console.log('isControlsHidden', isControlsHidden)
    if (wrapperWidth >= controlsWidth && isControlsHidden) {
      this.setState({ isControlsHidden: false })
      console.log('Showcontrols')
    } else if (wrapperWidth < controlsWidth && !isControlsHidden) {
      this.setState({ isControlsHidden: true })
      console.log('HideControls')
    }
  }

  handleClick (type, index) {
    this.props.setFilterType(type, index)
  }

  getControls () {
    return controls.map((control, i) => {
      const { type, name } = control
      let controlClasses = classNames({
        'vcv-ui-form-button': true,
        'vcv-ui-form-button--active': type === this.props.filterType
      })
      return <button
        key={`hub-control-${type}`}
        className={controlClasses}
        type='button'
        onClick={() => this.handleClick(type, i)}
      >
        {name}
      </button>
    })
  }

  render () {
    console.log('render this.state.isControlsHidden', this.state.isControlsHidden)
    let controlWrapperClasses = classNames({
      'vcv-ui-form-buttons-group': true,
      'vcv-ui-form-button-group--large': true,
      'vcv-is-hidden': this.state.isControlsHidden
    })
    return <div className={controlWrapperClasses}>
      {this.getControls()}
    </div>
  }
}
