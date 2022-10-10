import React from 'react'
import { createRoot } from 'react-dom/client'
import 'public/variables'
import 'public/config/wp-services'
import 'public/config/wp-attributes'

import ActivationSection from './components/account/activationSection'

const sectionContainer = document.querySelector('[data-section=vcv-getting-started],[data-section=vcv-activate-license],[data-section=vcv-update]')

const root = createRoot(sectionContainer)
root.render(<ActivationSection />)
