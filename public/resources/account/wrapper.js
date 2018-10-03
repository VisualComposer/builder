import React from 'react'
import ReactDOM from 'react-dom'
import ActivationSection from './activationSection'

export default class Wrapper extends React.Component {
  render () {
    return (
      <ActivationSection />
    )
  }
}

ReactDOM.render(
  <Wrapper />,
  document.querySelector('.vcv-settings')
)
