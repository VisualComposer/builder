import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class PinterestPinit extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertHtml(this.props.atts)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.atts.type !== this.props.atts.type) {
      this.insertHtml(this.props.atts)
    }
  }

  insertHtml (props) {
    const button = this.createHtml(props)
    const script = '<script type="text/javascript" async defer src="https://assets.pinterest.com/js/pinit.js"></script>'
    const html = button + script
    const wrapper = this.refs.pinterestInner
    this.updateInlineHtml(wrapper, html)

    const iframe = document.querySelector('#vcv-editor-iframe').contentWindow
    if (iframe.PinUtils) {
      iframe.PinUtils.build(this.getDomNode())
    }
  }

  createHtml (props) {
    const element = document.createElement('a')
    element.href = 'https://www.pinterest.com/pin/create/button/'

    if (props.type === 'default') {
      element.setAttribute('data-pin-do', 'buttonBookmark')
    } else {
      element.setAttribute('data-pin-do', 'buttonPin')
    }

    if (props.type === 'round') {
      element.setAttribute('data-pin-shape', 'round')
    } else if (props.type === 'large') {
      element.setAttribute('data-pin-height', '28')
    } else if (props.type === 'tallBubble') {
      element.setAttribute('data-pin-config', 'above')
    } else if (props.type === 'tallCounter') {
      element.setAttribute('data-pin-config', 'beside')
    }

    const elementWrapper = document.createElement('div')
    elementWrapper.appendChild(element)
    return elementWrapper.innerHTML
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, alignment, metaCustomId } = atts
    let classes = 'vce-pinterest-pinit'
    const innerClasses = 'vce-pinterest-pinit-inner vce'
    const customProps = {}

    if (customClass) {
      classes += ` ${customClass}`
    }

    if (alignment) {
      classes += ` vce-pinterest-pinit--align-${alignment}`
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div {...customProps} className={classes} {...editor}>
        <div className={innerClasses} ref='pinterestInner' id={'el-' + id} {...doAll}>Google Plus Button</div>
      </div>
    )
  }
}
