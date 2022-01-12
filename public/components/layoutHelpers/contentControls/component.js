import React from 'react'
import RowControl from './lib/rowControl'
import vcCake from 'vc-cake'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const dataManager = vcCake.getService('dataManager')
const roleManager = vcCake.getService('roleManager')

export default class ContentControls extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      this.isMobile = true
    }
    this.container = React.createRef()
  }

  componentDidMount () {
    const { current } = this.container
    const col = current.closest('.vce-col')
    const colInner = current.closest('.vce-col-inner')
    const colContent = current.closest('.vce-col-content')

    col && col.setAttribute('data-vcv-centered-control', true)
    colInner && colInner.setAttribute('data-vcv-centered-control', true)
    colContent && colContent.setAttribute('data-vcv-centered-control', true)
  }

  componentWillUnmount () {
    const { current } = this.container
    const col = current.closest('.vce-col')
    const colInner = current.closest('.vce-col-inner')
    const colContent = current.closest('.vce-col-content')

    col && col.removeAttribute('data-vcv-centered-control')
    colInner && colInner.removeAttribute('data-vcv-centered-control')
    colContent && colContent.removeAttribute('data-vcv-centered-control')
  }

  handleClick () {
    // TODO: Check this
    const element = vcCake.getService('document').get(this.props.id)
    let options = ''
    const children = vcCake.getService('cook').getContainerChildren(element.tag)
    if (children.length === 1) {
      options = children[0].tag
    }
    const currentState = workspaceSettings.get()
    if (currentState && currentState.action === 'add') {
      workspaceSettings.set(false)
      setTimeout(() => {
        workspaceStorage.trigger('add', this.props.id, options)
      }, 300)
    } else {
      workspaceStorage.trigger('add', this.props.id, options)
    }
  }

  render () {
    const localizations = dataManager.get('localizations')
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    let classes = 'vcvhelper vcv-row-control-container vcv-row-control-container-hide-labels vcv-is-disabled-outline'
    if (this.isMobile) {
      classes += ' vcv-row-control-container-mobile-add'
    }
    if (!isAbleToAdd) {
      classes += ' vcv-row-control-container--add-disabled'
    }
    const action = isAbleToAdd ? this.handleClick : null

    return (
      <div
        className={classes}
        title={addElementText}
        onClick={action}
        ref={this.container}
      >
        <RowControl />
      </div>
    )
  }
}
