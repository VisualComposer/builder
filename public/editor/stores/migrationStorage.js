import { addStorage, getStorage, getService, env } from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import PopupComponent from 'public/components/migrationNotice/popupComponent'

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

  storage.state('icon').set('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABGdBTUEAALGPC/xhBQAABP9JREFUeAHtnEtrU0EUx5M0ERep1RaEoubRfAI/gGtdqCC46EIKogtBcFWoIHTRVevShQ90Y0XQRVUouHFTRFC0IIjbNl3ZiNKFfSDSNP4n5IbD9ObeeWSmydwJDPfM5JyZe35zzsw0TW46ZeHVaDQOra6uzqTT6QnIoxaGNDoE/FiHH/NjY2PTaaMjtTpfWVmZhThlYyzLY8xZAYjo++FC5PGTwyIxyzeaqFN4CHsTQ1jtEwHRHI/5lbE6soODeYCak6qVwrVa7fjOzs4trAXL5XL5jea99KW5VgRub28/wjpwZ29v73W1WnVxl42dVK0IRO+VYARAnAXEBiLxbtAmeg0WZVH9QI9uSHwfUe8F9iJX2k+YfiRAALkKMJNI0cNhxoi+k7QdunM4821WKpUHtN1lORIggNyD83mAkmFwG8oeYItYXoZcS/eDgk3bJC5l2oqcEGUX9R7XTbPKLwdhOkFbZAQGSuyKNL44MDCwQdt2d3efot5eB6HzcXBw8AbVcV0WBggQn4vF4k8KBOsdqzcBAt6noaGhcyMjI5tUx3VZ6xgDaLMo6yjPAe8s4P1xHRjvn0wE8rYprC2LaGQlsS+tCEwsNeK4B0hgqIgeoAo1YhMJEJvDN6bLNgr8ifab2HmxRSByEwG4s9C7gOs7lLqntp9AJEBEXQ0mj/eb+ZaAQGQKB0r+2plAZAR2NjP3jszfoebuQrxnH4HirEI1s/ioyql/eod6abAxi5SZQf9Tkp/5dfWWZD9u6urgmp1lcDyZ0Owj0eYshdvfVTEVCf22MchEhN9EZGiF6HqAIVBkmnriHCia4vwSo2rHAOnYUsA+AikNBTk2AkVnih+bjxb+fVfqsQBtO8qDF51AVTvmn46tT2HNCJGKQH6mNMd2wtxHoOY0SkWg5lhC5qJrHt+Zqh3rR8fWRyA/E5J1D1ASGK/eEymsujmp2jEIOrYUoo9ASkNB9gAVoFGTnkhh0V2QTztVOwZAx5YC9BFIaSjIHqACNGrSEynMpya9wShZ1Y71qWNL70kKoOi6QQdwXfYprDnDHqAmwNgU7sZa4XLqxwLUnKCmeTabTeE3JU3ZJZj4UsK6lRTO51V+8NSNqTPbB76UMG8lAoeHh5uebG1ttSPRrGtme2eRx+BheZu2ApC5wyAGIE26R5cI/GrU+EM1rKSwSWAH3XdsBNIZPcib7cZpwMT9+wjUpBobgZr997U5su8MNoxLKM9KpdLXMGdiAfZq6oQ508027LLsq89vcWVnsMsohbD+fQqHUUEbnhdxDJfgAHuqg1rKA+xERrA9NoVN7sIuLA+Jj0Ck6lHBYAtVSyxAZFYRz3xYxiaxAYjKD8qITWEX0owPHYBjO+oSSgkAUyjXID9EkX7FApTusccNGDyc65YArURudRQReZ3UGdQjtN5JThxAwHsCOGUOyAm0Kf2sNxag7C7cBylf5OCJVH91UooF2Mmwj9snce8LKDniA3tY0HtSb4uI2L+ZTOZ+u4ETEgcQGbK4trY2Xq/XX4JF039AqqL9PMdGqBoLsA9SUshRqoQPBl5hMxlH2wsUxuALfV9GTuw5EJ9WL+RyudOAdQXPhrgpA43qxkYgVXZNLhQK3+ETK8qvxEagMjHO0APkgMhWs9iB2L/omj+6lj3zyQ5mU5/5ZWO8DODN2xjI9hi2/EpjIKee2tHKqHkcv6Yh/zM9cf8Bb1ZnhIVP7aEAAAAASUVORK5CYII=')
})
