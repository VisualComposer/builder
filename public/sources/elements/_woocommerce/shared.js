import React from 'react'

let ajax = (data, successCallback, failureCallback) => {
  let request
  request = new window.XMLHttpRequest()
  request.open('POST', window.vcvAjaxUrl, true)
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      successCallback(request)
    } else {
      if (typeof failureCallback === 'function') {
        failureCallback(request)
      }
    }
  }
  request.send(window.$.param(data))

  return request
}

let render = (props, state) => {
  let { id, atts, editor } = props
  let { designOptions } = atts

  let customProps = {}
  let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
  let animations = []
  devices.forEach((device) => {
    let prefix = designOptions.visibleDevices[ device ]
    if (designOptions[ device ].animation) {
      if (prefix) {
        prefix = `-${prefix}`
      }
      animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
    }
  })
  if (animations.length) {
    customProps[ 'data-vce-animate' ] = animations.join(' ')
  }
  return (
    <div className='vce vce-woocommerce-wrapper' {...customProps} id={'el-' + id} {...editor}>
      <div dangerouslySetInnerHTML={state.shortcodeContent || { __html: '' }} />
    </div>
  )
}
render.propTypes = {
  id: React.PropTypes.string,
  atts: React.PropTypes.array,
  editor: React.PropTypes.array
}

module.exports = {
  ajax: ajax,
  render: render
}
