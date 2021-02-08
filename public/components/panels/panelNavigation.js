import React from 'react'
import NavigationSlider from 'public/components/navigationSlider/navigationSlider'

export default class PanelNavigation extends React.Component {
  render () {
    return (
      <div className='vcv-ui-panel-navigation-container'>
        <NavigationSlider {...this.props} />
      </div>
    )
  }
}
