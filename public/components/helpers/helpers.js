import React from 'react'
import HelperContainer from './lib/helperContainer'
import Welcome from './lib/welcome'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const elementsStorage = vcCake.getStorage('elements')

export default class Helpers extends React.Component {
  helpers = {
    'plus-control': {
      heading: 'Add Content',
      description: 'This is your content library. <a href="https://visualcomposer.com/help/content-elements-structure/add-content-element/" target="blank">Add an element</a> by dragging or clicking on it and find templates you have created or downloaded from the <a href="https://visualcomposer.com/help/visual-composer-hub/" target="blank">Hub</a>.',
      step: 1
    },
    'element-controls': {
      heading: 'Element Controls',
      description: 'Use <a href="https://visualcomposer.com/help/interface/element-controls/" target="blank">element controls</a> to see your <a href="https://visualcomposer.com/help/content-elements-structure/grid-layout-row-column/" target="blank">layout structure</a> or modify the particular row, column, or content element.',
      step: 2,
      helperImage: 'vcv-helper-box-image element-controls'
    },
    'quick-actions': {
      heading: 'Quick Actions',
      description: 'Use <a href="https://visualcomposer.com/help/content-elements-structure/add-content-element/" target="blank">quick actions</a> at the bottom of the page to add the most popular row/column layouts and elements.',
      step: 3,
      helperImage: 'vcv-helper-box-image bottom-menu'
    },
    'insights-control': {
      heading: 'Insights',
      description: '<a href="https://visualcomposer.com/help/visual-composer-insights-assistant/" target="blank">Validate your page</a> for SEO and performance to speed up your site and rank higher.',
      step: 4
    },
    'layout-control': {
      heading: 'Responsive View',
      description: 'Check how your page looks on different devices. Select the device type to <a href="https://visualcomposer.com/help/responsive-design/" target="blank">preview your layout responsiveness</a>.',
      step: 5
    },
    'hub-control': {
      heading: 'Visual Composer Hub',
      description: 'Access <a href="https://visualcomposer.com/help/visual-composer-hub/" target="blank">Visual Composer Hub</a> in-built cloud library to download additional elements, templates, add-ons, stock images, and more.',
      step: 6
    },
    'settings-control': {
      heading: 'On-Page Settings',
      description: 'Change <a href="https://visualcomposer.com/help/settings/" target="blank">settings of your page or post</a>, modify the layout, control popups, add custom CSS, and Javascript.',
      step: 7
    },
    'save-control': {
      heading: 'Publishing Options',
      description: 'Preview, save, and publish your content.',
      step: 8,
      position: {
        vertical: 'bottom'
      }
    }
  }

  visibleItems = []

  constructor (props) {
    super(props)
    this.state = {
      activeStep: 1,
      isGuideVisible: true,
      loaded: false
    }

    this.iframeContentWindow = null

    this.setActiveStep = this.setActiveStep.bind(this)
    this.setNextActiveStep = this.setNextActiveStep.bind(this)
    this.closeGuide = this.closeGuide.bind(this)
    this.handleEditorLoaded = this.handleEditorLoaded.bind(this)
    this.resizeListener = lodash.debounce(this.resizeListener.bind(this), 50)

    elementsStorage.state('document').onChange(this.handleEditorLoaded)
  }

  handleEditorLoaded () {
    this.setState({ loaded: true })
    this.iframeContentWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
    this.iframeContentWindow.addEventListener('resize', this.resizeListener)
    elementsStorage.state('document').ignoreChange(this.handleEditorLoaded)
  }

  resizeListener () {
    this.setState({ width: window.innerWidth })
  }

  setNextActiveStep () {
    const currentIndex = this.visibleItems.findIndex(item => item.step === this.state.activeStep)
    const nextIndex = currentIndex + 1
    if (this.visibleItems[nextIndex]) {
      const nextStep = this.visibleItems[nextIndex].step
      this.setState({ activeStep: nextStep })
    }
  }

  closeGuide () {
    this.iframeContentWindow.removeEventListener('resize', this.resizeListener)
    this.setState({ isGuideVisible: false })
  }

  setActiveStep (step) {
    this.setState({ activeStep: step })
  }

  isInViewPort (elem) {
    const bounding = elem.getBoundingClientRect()
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  render () {
    if (!this.state.loaded || !this.state.isGuideVisible || window.innerWidth < 768) {
      return null
    }

    const Utils = vcCake.getService('utils')
    Utils.setCookie('navPosition', 'left')
    const dataProcessor = vcCake.getService('dataProcessor')
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'editors:initialHelpers:disable:adminNonce'
    })

    const $helpers = document.querySelectorAll('[data-vcv-guide-helper]')
    const items = []
    this.visibleItems = []

    $helpers.forEach((item) => {
      const boundingRect = item.getBoundingClientRect()
      const left = boundingRect.left
      const top = boundingRect.top
      const width = boundingRect.width
      const height = boundingRect.height
      const helperId = item.getAttribute('data-vcv-guide-helper')
      const helperData = this.helpers[helperId]

      if (this.isInViewPort(item)) {
        helperData.left = left + width
        helperData.top = top + (height / 2)

        if (helperData.position) {
          const { horizontal, vertical } = helperData.position
          if (horizontal === 'left') {
            helperData.left = left
          } else if (horizontal === 'center') {
            helperData.left = left + (width / 2)
          }
          if (vertical === 'top') {
            helperData.top = top
          } else if (vertical === 'bottom') {
            helperData.top = top + height
          }
        }

        helperData.helperId = helperId
        this.visibleItems.push(helperData)
      }

      helperData.helperPosition = {
        bottom: false
      }

      if (window.innerWidth < left + 400) {
        helperData.helperPosition.bottom = true
      }
    })

    this.visibleItems.sort((a, b) => (a.step > b.step) ? 1 : ((b.step > a.step) ? -1 : 0))

    this.visibleItems.forEach((item, index) => {
      items.push(
        <HelperContainer
          key={item.helperId}
          top={item.top}
          left={item.left}
          helperPosition={item.helperPosition}
          isActive={item.step === this.state.activeStep}
          helperData={item}
          isLast={this.visibleItems.length - 1 === index}
          handleCloseGuide={this.closeGuide}
          handleActiveChange={this.setActiveStep}
          handleNextClick={this.setNextActiveStep}
        />
      )
    })

    return (
      <div className='vcv-helpers-container'>
        <div className='vcv-helpers-wrapper'>
          {items}
        </div>
        <Welcome />
      </div>
    )
  }
}
