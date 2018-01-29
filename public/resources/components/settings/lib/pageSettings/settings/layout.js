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

    if (typeof this.state.currentLayout !== 'string' || this.state.currentLayout === 'vcv-header-footer-layout.php') {
      const layoutSettings = [
        {
          layoutName: 'Header (add localization)',
          data: {
            'Header 1': 3007,
            'Header 2': 3041
          }
        },
        {
          layoutName: 'Footer (add localization)',
          data: {
            'Footer 1': 3007,
            'Footer 2': 3041
          }
        }
      ]

      layoutSettings.forEach((item, index) => {
        layoutDropdowns.push(<LayoutDropdown layoutName={item.layoutName} data={item.data} key={`layout-settings-dropdown-${index}`} />)
      })
    }

    return layoutDropdowns
  }
}
