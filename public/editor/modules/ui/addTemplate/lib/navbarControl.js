import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'
const {getData, setData} = vcCake

export default class AddTemplateControl extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    value: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isWindowOpen: getData('template:isWindowOpen')
    }
    this.toggleAddTemplate = this.toggleAddTemplate.bind(this)
    this.updateWindow = this.updateWindow.bind(this)
  }

  componentWillMount () {
    this.props.api
      .reply('bar-content-end:show', this.updateWindow)
      .reply('bar-content-end:hide', this.updateWindow)
  }

  componentWillUnmount () {
    this.props.api
      .reply('bar-content-end:show', this.updateWindow)
      .reply('bar-content-end:hide', this.updateWindow)
  }

  updateWindow (isOpen = false) {
    setData('templates:isWindowOpen', isOpen === 'add-template')
    this.setState({ isWindowOpen: isOpen === 'add-template' })
  }

  toggleAddTemplate (e) {
    e && e.preventDefault()
    if (this.state.isWindowOpen) {
      this.props.api.request('app:templates', false)
    } else {
      this.props.api.request('app:templates', true)
    }
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isWindowOpen
    })
    let isDisabled = true
    if (vcCake.env('FEATURE_ADD_ELEMENT_SEARCH')) {
      isDisabled = false
    }
    return (
      <a
        className={controlClass}
        onClick={this.toggleAddTemplate}
        href='#'
        disabled={isDisabled}
        title='Template'
      >
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-template' />
          <span>Template</span>
        </span>
      </a>
    )
  }
}
