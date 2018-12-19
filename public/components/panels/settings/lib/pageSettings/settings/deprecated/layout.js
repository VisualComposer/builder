import React from 'react'
import { getStorage } from 'vc-cake'
import LayoutDropdown from '../layoutDropdown'

const settingsStorage = getStorage('settings')

export default class LayoutSettings extends React.Component {
  constructor (props) {
    super(props)
    let templateStorageData = settingsStorage.state('pageTemplate').get()
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
    const layoutData = window.VCV_LAYOUTS_DATA && window.VCV_LAYOUTS_DATA()
    const currentLayoutData = layoutData && layoutData[ this.state.currentLayout ]
    const layoutSettings = []

    if (currentLayoutData) {
      if (currentLayoutData.header) {
        const headerData = window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES()
        if (headerData) {
          layoutSettings.push({
            layoutName: 'Header',
            data: headerData
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

      if (currentLayoutData.sidebar) {
        const sidebarData = window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES()
        if (sidebarData) {
          layoutSettings.push({
            layoutName: 'Sidebar',
            data: sidebarData
          })
        }
      }
    }

    if (layoutSettings.length) {
      layoutSettings.forEach((item, index) => {
        layoutDropdowns.push(<LayoutDropdown layoutName={item.layoutName} data={item.data} key={`layout-settings-dropdown-${index}`} />)
      })
    }

    return layoutDropdowns
  }
}
