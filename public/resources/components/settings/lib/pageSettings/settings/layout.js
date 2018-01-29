import React from 'react'
import {getStorage} from 'vc-cake'
import LayoutDropdown from './layoutDropdown'

const settingsStorage = getStorage('settings')

export default class LayoutSettings extends React.Component {
  constructor (props) {
    super(props)
    let templateStorageData = settingsStorage.state('pageTemplate').get()
    this.state = {
      currentLayout: templateStorageData
    }
  }

  componentDidMount () {
    settingsStorage.state('pageTemplate').onChange((data) => {
      this.setState({ currentLayout: data })
    })
  }

  render () {
    const layoutDropdowns = []

    // header is just hardcoded for now
    if (typeof this.state.currentLayout !== 'string' || this.state.currentLayout === 'vcv-header-footer-layout.php') {
      const headerData = window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES()
      const layoutSettings = [
        {
          layoutName: 'Header',
          data: headerData.all
        }
      ]

      layoutSettings.forEach((item, index) => {
        layoutDropdowns.push(<LayoutDropdown layoutName={item.layoutName} data={item.data} key={`layout-settings-dropdown-${index}`} />)
      })
    }

    return layoutDropdowns
  }
}
