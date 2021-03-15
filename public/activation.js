import React from 'react'
import ReactDOM from 'react-dom'
import 'public/variables'
import 'public/config/wp-services'
import 'public/config/wp-attributes'

import ActivationSection from './components/account/activationSection'

ReactDOM.render(
  <ActivationSection />,
  document.querySelector('[data-section=vcv-getting-started],[data-section=vcv-activate-license],[data-section=vcv-update]')
)
