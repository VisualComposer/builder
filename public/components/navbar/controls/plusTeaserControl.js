import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import HubContainer from 'public/components/panels/hub/hubContainer'

const dataProcessor = getService('dataProcessor')
const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentState = getStorage('workspace').state('content')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default class PlusTeaserControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.handleClickHub = this.handleClickHub.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.state = {
      isActive: workspaceContentState.get() === 'addHubElement',
      showBadge: dataManager.get('hubTeaserShowBadge')
    }
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'addHubElement' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)

    innerAPI.mount('panel:addHubElement', () => <HubContainer key='panels-container-addHubElement' namespace='editor' />)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
  }

  handleClickHub (e) {
    e && e.preventDefault()

    const options = { bundleType: undefined }
    if (roleManager.can('hub_giphy', roleManager.defaultTrue())) {
      options.filterType = 'giphy'
      options.id = 8
    }
    if (roleManager.can('hub_unsplash', roleManager.defaultTrue())) {
      options.filterType = 'unsplash'
      options.id = 7
    }
    if (roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue())) {
      options.filterType = 'hubHeader'
      options.id = 4
    }
    if (roleManager.can('hub_addons', roleManager.defaultTrue())) {
      options.filterType = 'addon'
      options.id = 3
    }
    if (roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())) {
      options.filterType = 'element'
      options.id = 0
    }

    const settings = this.state.isActive ? false : {
      action: 'addHub',
      elementAccessPoint: null,
      activeTab: '',
      options: options
    }
    workspaceSettings.set(settings)
    if (dataManager.get('hubTeaserShowBadge') || this.state.showBadge) {
      dataProcessor.appAdminServerRequest({
        'vcv-action': 'vcv:hub:teaser:visit:adminNonce'
      })
      dataProcessor.appAllDone().then(() => {
        dataManager.set('hubTeaserShowBadge', false)
        this.setState({ showBadge: false })
      })
    }
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.addPremiumElement : 'Visual Composer Hub'

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--warning': this.state.showBadge
    })

    return (
      <span className={controlClass} title={name} onClick={this.handleClickHub} data-vcv-guide-helper='hub-control'>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-hub-shop' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
