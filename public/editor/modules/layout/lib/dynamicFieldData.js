import React, { useState, useEffect } from 'react'
import { getService } from 'vc-cake'

const dataProcessor = getService('dataProcessor')
const { getShortcodesRegexp } = getService('utils')
const spinnerHTML = <span className='vcv-ui-content-editable-helper-loader vcv-ui-wp-spinner' />

export function DynamicFieldData (props) {
  const { atts, field } = props
  const [ content, setContent ] = useState(spinnerHTML)
  let returnData

  useEffect(() => {
    const getShortcodeContent = (content) => {
      setContent(spinnerHTML)
      if (content && (content.match(getShortcodesRegexp()) || content.match(/https?:\/\//) || content.indexOf('<!-- wp') !== -1)) {
        dataProcessor.appServerRequest({
          'vcv-action': 'elements:ajaxShortcode:adminNonce',
          'vcv-shortcode-string': content,
          'vcv-nonce': window.vcvNonce,
          'vcv-source-id': window.vcvSourceID
        }).then((data) => {
          try {
            const jsonData = JSON.parse(data)
            setContent(jsonData.shortcodeContent)
          } catch (e) {
            console.warn('Failed to parse json', e)
          }
        })
      } else {
        return null
      }
    }

    getShortcodeContent(atts[ field ])
  }, [ atts ])

  if (atts[ field ].indexOf('featured') > -1) {
    returnData = atts[ field ]
  } else {
    returnData = content
  }

  return returnData
}
