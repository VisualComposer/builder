import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

const AssetsManager = vcCake.getService('assets-manager')

export default class TemplateControl extends React.Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    api: React.PropTypes.object.isRequired,
    applyTemplate: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      letter: this.props.name.charAt(0).toUpperCase()
    }
    this.applyTemplate = this.applyTemplate.bind(this)
  }

  componentDidMount () {
    this.ellipsize('.vcv-ui-item-element-name')
    // this.ellipsize('.vcv-ui-item-preview-text')
  }

  applyTemplate (e) {
    e && e.preventDefault()
    this.props.applyTemplate(this.props.data)
  }

  ellipsize (selector) {
    let element = ReactDOM.findDOMNode(this).querySelector(selector)
    let wordArray = element.innerHTML.split(' ')
    while (element.scrollHeight > element.offsetHeight && wordArray.length > 0) {
      wordArray.pop()
      element.innerHTML = wordArray.join(' ') + '...'
    }
    return this
  }

  render () {
    let { name } = this.props

    let nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    let publicPathThumbnail

    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      publicPathThumbnail = vcCake.getService('wipAssetsManager').getSourcePath('images/template-thumbnail.png')
    } else {
      publicPathThumbnail = AssetsManager.getSourcePath('images/template-thumbnail.png')
    }
    return (
      <li className='vcv-ui-item-list-item'>
        <a className='vcv-ui-item-element'
          onClick={this.applyTemplate}
        >
          <span
            className='vcv-ui-item-element-content'
            data-letter={this.state.letter}
          >
            <img
              className='vcv-ui-item-element-image'
              src={publicPathThumbnail}
              alt=''
            />
            <span className='vcv-ui-item-overlay'>
              <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
        </a>
      </li>
    )
  }
}
