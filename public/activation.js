import React from 'react'
import ReactDOM from 'react-dom'
import ActivationSection from './components/account/activationSection'
import './sources/less/wpsettings-update/init.less'
import 'public/variables'
import 'public/config/wp-services'
import 'public/config/wp-attributes'

ReactDOM.render(
  <ActivationSection />,
  document.querySelector('.vcv-settings')
)
