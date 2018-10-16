import React from 'react'
import InitialScreen from './initialScreen'
import LoadingScreen from './loadingScreen'
import FinalScreen from './finalScreen'

const ActivationSectionContext = React.createContext()

export default class ActivationSectionProvider extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeScreen: 'finalScreen'
    }

    this.setActiveScreen = this.setActiveScreen.bind(this)
  }

  setActiveScreen (activeScreen) {
    this.setState({ activeScreen })
  }

  render () {
    let activeScreen = ''
    if (this.state.activeScreen === 'initialScreen') {
      activeScreen = <InitialScreen />
    } else if (this.state.activeScreen === 'loadingScreen') {
      activeScreen = <LoadingScreen />
    } else if (this.state.activeScreen === 'finalScreen') {
      activeScreen = <FinalScreen />
    }

    return (
      <ActivationSectionContext.Provider
        value={{
          setActiveScreen: this.setActiveScreen
        }}
      >
        <div className='vcv-activation-section'>
          {activeScreen}
        </div>
      </ActivationSectionContext.Provider>
    )
  }
}

export const ActivationSectionConsumer = ActivationSectionContext.Consumer
