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
    let { designOptions, customClass, alignment, metaCustomId } = atts
    let classes = 'vce-google-plus-button'
    let innerClasses = 'vce-google-plus-button-inner vce'
    let customProps = {}

    if (customClass) {
      classes += ` ${customClass}`
    }

    if (alignment) {
      classes += ` vce-google-plus-button--align-${alignment}`
    }

    if (designOptions.device) {
      let animations = []
      Object.keys(designOptions.device).forEach((device) => {
        let prefix = (device === 'all') ? '' : device
        if (designOptions.device[ device ].animation) {
          if (prefix) {
            prefix = `-${prefix}`
          }
          animations.push(`vce-o-animate--${designOptions.device[ device ].animation}${prefix}`)
        }
      })
      if (animations.length) {
        customProps[ 'data-vce-animate' ] = animations.join(' ')
      }
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return <div {...customProps} className={classes} {...editor}>
      <div className={innerClasses} ref='googlePlusInner' id={'el-' + id} {...doAll}>Google Plus Button</div>
    </div>
  }
}
