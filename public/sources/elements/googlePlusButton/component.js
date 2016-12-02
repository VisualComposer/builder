/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertHtml(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    let { size, annotation } = this.props.atts

    if (size !== nextProps.atts.size || annotation !== nextProps.atts.annotation) {
      this.insertHtml(nextProps.atts)
    }
  }

  insertHtml (props) {
    let button = this.createHtml(props)
    let script = '<script src="https://apis.google.com/js/platform.js" async defer></script>'
    let html = button + script
    const wrapper = this.refs.googlePlusInner
    this.updateInlineHtml(wrapper, html)
  }

  createHtml (props) {
    let element = document.createElement('div')
    let { size, annotation } = props

    element.className = 'g-plusone'

    if (size && size !== 'standard') {
      element.setAttribute('data-size', size)
    }

    if (annotation && annotation !== 'bubble') {
      element.setAttribute('data-annotation', annotation)
    }

    let elementWrapper = document.createElement('div')
    elementWrapper.appendChild(element)
    return elementWrapper.innerHTML
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment } = atts
    let classes = 'vce-google-plus-button'
    let innerClasses = 'vce-google-plus-button-inner vce'
    let customProps = {}

    if (customClass) {
      classes += ` ${customClass}`
    }

    if (alignment) {
      classes += ` vce-google-plus-button--align-${alignment}`
    }

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

    return <div {...customProps} className={classes} {...editor}>
      <div className={innerClasses} ref='googlePlusInner' id={'el-' + id}>Google Plus Button</div>
    </div>
  }
}
