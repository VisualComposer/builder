import React, { useState, useEffect, useCallback } from 'react'
import HelperContainer from './lib/helperContainer'
import Welcome from './lib/welcome'
import { getService, getStorage } from 'vc-cake'
import lodash from 'lodash'

const dataManager = getService('dataManager')
const elementsStorage = getStorage('elements')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')

const addContent = localizations.addContent
const elementControls = localizations.elementControls
const quickActions = localizations.quickActions
const insights = localizations.insights
const responsiveView = localizations.responsiveView
const addPremiumElement = localizations.addPremiumElement
const onPageOptions = localizations.onPageOptions
const publishingOptions = localizations.publishingOptions
const thisIsYourContentLibrary = localizations.thisIsYourContentLibrary
const useElementControls = localizations.useElementControls
const useQuickActions = localizations.useQuickActions
const validateYourPage = localizations.validateYourPage
const checkHowYourPageLooksOnDifferentDevices = localizations.checkHowYourPageLooksOnDifferentDevices
const accessVisualComposerHub = localizations.accessVisualComposerHub
const changeOptionsOfYourPageOrPost = localizations.changeOptionsOfYourPageOrPost
const previewSaveAndPublish = localizations.previewSaveAndPublish
let iframeContentWindow:any = null // eslint-disable-line

const getHelperData = () => {
  return {
    'plus-control': {
      heading: addContent,
      description: thisIsYourContentLibrary,
      step: 1,
      position: {
        horizontal: 'bottom'
      },
      icons: [{
        icon: 'add',
        left: -48,
        top: -5
      }]
    },
    'element-controls': {
      heading: elementControls,
      description: useElementControls,
      step: 2,
      helperImage: 'vcv-helper-box-image element-controls'
    },
    'quick-actions': {
      heading: quickActions,
      description: useQuickActions,
      step: 3,
      helperImage: 'vcv-helper-box-image bottom-menu'
    },
    'insights-control': {
      heading: insights,
      description: validateYourPage,
      step: 4,
      icons: [{
        icon: 'lamp',
        left: -48,
        top: -5
      }]
    },
    'layout-control': {
      heading: responsiveView,
      description: checkHowYourPageLooksOnDifferentDevices,
      step: 5,
      icons: [{
        icon: settingsStorage.state('outputEditorLayoutDesktop').get() === 'dynamic' ? 'multiple-devices' : 'desktop',
        left: -48,
        top: -5
      }]
    },
    'hub-control': {
      heading: addPremiumElement,
      description: accessVisualComposerHub,
      step: 6,
      icons: [{
        icon: 'hub-shop',
        left: -48,
        top: -5
      }]
    },
    'settings-control': {
      heading: onPageOptions,
      description: changeOptionsOfYourPageOrPost,
      step: 7,
      position: {
        horizontal: 'top'
      },
      icons: [{
        icon: 'cog',
        left: -48,
        top: -5
      }]
    },
    'save-control': {
      heading: publishingOptions,
      description: previewSaveAndPublish,
      step: 8,
      position: {
        horizontal: 'top'
      },
      icons: [{
        icon: 'save',
        left: -48,
        top: -5
      }]
    }
  }
}

declare global {
  interface Window {
    readonly innerWidth: number
  }
}

interface ItemData {
  helperId: string,
  top: number,
  left: number,
  helperPosition: {
    bottom: number
  },
  position: {
    horizontal: string
  },
  heading: string,
  description: string,
  helperImage: string,
  step: number,
  icons: [{
    icon: string,
    left: number,
    top: number
  }]
}

const Helpers = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [isGuideVisible, setIsGuideVisible] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [helpers, setHelpers] = useState(getHelperData())
  const [width, setWidth] = useState(0)
  const $helpersElements:Element[] = Array.from(document.querySelectorAll('[data-vcv-guide-helper]'))
  const items:React.ReactElement[] = []
  const visibleItems:HTMLElement | ItemData[] = []

  const resizer = () => {
    if (width !== window.innerWidth) {
      setWidth(window.innerWidth)
    }
  }
  const resizeListener = lodash.debounce(resizer, 50)

  const handleEditorLoaded = useCallback(() => {
    setLoaded(true)
    const iframe = window.document.querySelector('.vcv-layout-iframe') as HTMLIFrameElement
    iframeContentWindow = iframe.contentWindow
    iframeContentWindow?.addEventListener('resize', resizeListener)
    elementsStorage.state('document').ignoreChange(handleEditorLoaded)
  }, [resizeListener])

  useEffect(() => {
    elementsStorage.state('document').onChange(handleEditorLoaded)
    settingsStorage.state('outputEditorLayoutDesktop').onChange(resetHelpersData)
    return () => {
      settingsStorage.state('outputEditorLayoutDesktop').ignoreChange(resetHelpersData)
    }
  }, [handleEditorLoaded])

  const resetHelpersData = () => {
    setHelpers(getHelperData())
  }

  const setNextActiveStep = () => {
    const currentIndex = visibleItems.findIndex((item: { step: number }) => item.step === activeStep)
    const nextIndex = currentIndex + 1
    if (visibleItems.length && visibleItems[nextIndex]) {
      const nextStep = visibleItems[nextIndex]?.step
      setActiveStep(nextStep)
    }
  }

  const closeGuide = () => {
    iframeContentWindow?.removeEventListener('resize', resizeListener)
    setIsGuideVisible(false)
  }

  const isInViewPort = (elem:Element) => {
    const bounding = elem.getBoundingClientRect()
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  if (!loaded || !isGuideVisible || window.innerWidth < 768) {
    return null
  }

  const Utils = getService('utils')
  Utils.setCookie('navPosition', 'left')
  const dataProcessor = getService('dataProcessor')
  dataProcessor.appAdminServerRequest({
    'vcv-action': 'editors:initialHelpers:disable:adminNonce'
  })

  $helpersElements.forEach((item:Element) => {
    const boundingRect = item.getBoundingClientRect()
    const left = boundingRect.left
    const top = boundingRect.top
    const width = boundingRect.width
    const height = boundingRect.height
    const helperId = item.getAttribute('data-vcv-guide-helper')
    // @ts-ignore
    const helperData = helpers[helperId]

    if (isInViewPort(item)) {
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
      visibleItems.push(helperData)
    }

    helperData.helperPosition = {
      bottom: false
    }

    if (window.innerWidth < left + 400) {
      helperData.helperPosition.bottom = true
    }
  })

  visibleItems.sort((a: {step:number}, b: {step:number}) => (a.step > b.step) ? 1 : ((b.step > a.step) ? -1 : 0))

  visibleItems.forEach((item:ItemData, index:number) => {
    items.push(
      <HelperContainer
        key={item.helperId}
        isActive={item.step === activeStep}
        helperData={item}
        isLast={visibleItems.length - 1 === index}
        handleCloseGuide={closeGuide}
        handleActiveChange={setActiveStep}
        handleNextClick={setNextActiveStep}
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

export default Helpers
