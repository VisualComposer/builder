import { addStorage, getStorage, getService, env } from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import PopupComponent from 'public/resources/components/migrationNotice/popupComponent'

addStorage('migration', (storage) => {
  const cook = getService('cook')
  const utils = getService('utils')
  const elementsStorage = getStorage('elements')

  if (env('FT_MIGRATION_NOTICE')) {
    storage.on('migrateContent', (contentData) => {
      if (!window.hasOwnProperty('VCV_API_WPBAKERY_WPB_MAP') && contentData.content.indexOf('[vc_row') !== -1) {
        // If no addon installed show popup with offer to install addon
        let $el = document.createElement('div')
        const addPopup = () => {
          ReactDOM.render(
            <PopupComponent disableNavBar hideLayoutBar />,
            $el
          )
        }
        addPopup()
      }
    })
  }

  storage.on('migrateContent', (contentData) => {
    window.setTimeout(() => {
      if (!contentData._migrated) {
        const textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(contentData.content, '__VCVID__') })
        if (textElement) {
          elementsStorage.trigger('add', textElement.toJS())
        }
      } else {
        let elements = storage.state('elements').get()
        let elementsArray = []
        for (let key in elements) {
          if (elements.hasOwnProperty(key)) {
            elementsArray.push(elements[ key ])
          }
        }
        elementsArray.sort((first, second) => first.element.order - second.element.order)
        elementsArray.forEach((element) => {
          elementsStorage.trigger('add', element.element, element.wrap, element.options)
        })
      }
    }, 15)
    // Timeout needed to be last in the call-stack
  })

  storage.on('add', (element, wrap = true, options = {}) => {
    let elements = storage.state('elements').get() || {}
    elements[ element.id ] = { element: element, wrap: wrap, options: options }
    storage.state('elements').set(elements)
  })

  storage.on('update', (id, element) => {
    let elements = storage.state('elements').get() || {}
    if (!elements[ id ]) {
      console.warn('Update called for wrong element', element)
    }
    elements[ id ].element = element
    storage.state('elements').set(elements)
  })
})
