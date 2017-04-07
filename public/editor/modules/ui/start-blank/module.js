import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import StartBlank from '../../../../resources/components/startBlank/component'

if (vcCake.env('FEATURE_START_BLANK')) {
  vcCake.add('ui-start-blank', (api) => {
    let startBlankOverlay = document.getElementById('vcv-layout-iframe-content')
    const removeStartBlank = () => {
      ReactDOM.unmountComponentAtNode(startBlankOverlay)
    }

    ReactDOM.render(
      <StartBlank api={api} unmountStartBlank={removeStartBlank} />,
      startBlankOverlay
    )

    api.reply(
      'data:changed',
      (data) => {
        if (data.length === 0) {
          ReactDOM.render(
            <StartBlank api={api} unmountStartBlank={removeStartBlank} />,
            startBlankOverlay
          )
        } else {
          removeStartBlank()
        }
      }
    )
  })
}
