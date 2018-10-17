import React from 'react'
import PropTypes from 'prop-types'
import InitialScreen from './initialScreen'
import LoadingScreen from './loadingScreen'
import FinalScreen from './finalScreen'

const ActivationSectionContext = React.createContext()

export default class ActivationSectionProvider extends React.Component {
  static propTypes = {
    activeScreen: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      activeScreen: props.activeScreen || 'initialScreen'
    }

    this.setActiveScreen = this.setActiveScreen.bind(this)
  }

  setActiveScreen (activeScreen) {
    this.setState({ activeScreen })
  }

  render () {
    let activeScreen = ''
    if (this.state.activeScreen === 'initialScreen') {
      activeScreen = <InitialScreen setActiveScreen={this.setActiveScreen} />
    } else if (this.state.activeScreen === 'loadingScreen') {
      activeScreen = <LoadingScreen setActiveScreen={this.setActiveScreen} />
    } else if (this.state.activeScreen === 'finalScreen') {
      activeScreen = <FinalScreen setActiveScreen={this.setActiveScreen} />
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
