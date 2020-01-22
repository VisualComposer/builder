import React from 'react'
import { getStorage } from 'vc-cake'
import LayoutDropdown from './layoutDropdown'

const settingsStorage = getStorage('settings')

export default class LayoutSettings extends React.Component {
  constructor (props) {
    super(props)
    const templateStorageData = settingsStorage.state('pageTemplate').get() || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT()) || {
      type: 'vc', value: 'blank'
    }
    this.state = {
      currentLayout: templateStorageData
    }
    this.setCurrentLayout = this.setCurrentLayout.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('pageTemplate').onChange(this.setCurrentLayout)
  }

  componentWillUnmount () {
    settingsStorage.state('pageTemplate').ignoreChange(this.setCurrentLayout)
  }

  setCurrentLayout (data) {
    this.setState({ currentLayout: data })
  }

  render () {
    const layoutDropdowns = []
    // TODO: Why not just use this.state from 'pageTemplate' ? [performance]
    const layouts = window.VCV_PAGE_TEMPLATES_LAYOUTS ? window.VCV_PAGE_TEMPLATES_LAYOUTS() : []
    const typeSearchResult = layouts.find((i) => {
      return i.type === this.state.currentLayout.type
    })

    let currentLayoutData = {}
    if (this.state.currentLayout.type === 'theme') {
      currentLayoutData.header = true
      currentLayoutData.footer = true
    } else if (typeSearchResult) {
      currentLayoutData = typeSearchResult.values.find((b) => {
        return b.value === this.state.currentLayout.value
      }) || {}
    }

    const layoutSettings = []

    if (currentLayoutData.header) {
      const headerData = window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES()
      if (headerData) {
        layoutSettings.push({
          layoutName: 'Header',
          data: headerData
        })
      }
    }

    if (currentLayoutData.sidebar) {
      const sidebarData = window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES()
      if (sidebarData) {
        layoutSettings.push({
          layoutName: 'Sidebar',
          data: sidebarData
        })
      }
    }

    if (currentLayoutData.footer) {
      const footerData = window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES()
      if (footerData) {
        layoutSettings.push({
          layoutName: 'Footer',
          data: footerData
        })
      }
    }

    if (layoutSettings.length) {
      layoutSettings.forEach((item, index) => {
        layoutDropdowns.push(
          <LayoutDropdown layoutName={item.layoutName} data={item.data} key={`layout-settings-dropdown-${index}`} />)
      })
    }

    return layoutDropdowns
  }
}
