import React from 'react'
import ReactDOM from 'react-dom'
import ActivationSection from './resources/account/activationSection'
import './sources/less/wpsettings-update/init.less'

ReactDOM.render(
  <ActivationSection activeScreen='loadingScreen' />,
  document.querySelector('.vcv-settings')
)
