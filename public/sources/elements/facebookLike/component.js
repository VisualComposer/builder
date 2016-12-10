/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertHtml(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    let { url, layout, size } = this.props.atts

    if (layout !== nextProps.atts.layout || size !== nextProps.atts.size || url !== nextProps.atts.url) {
      this.insertHtml(nextProps.atts)
    }
  }

  insertHtml (atts) {
    let html = this.createHtml(atts)
    const wrapper = this.refs.facebookLikeInner
    this.updateInlineHtml(wrapper, html)
  }

  createHtml (atts) {
    let { url, layout, size } = atts

    let html = `<iframe src="https://www.facebook.com/plugins/like.php?href=${url}&width=450&layout=${layout}&action=like&size=${size}&show_faces=false&share=false&height=35" width="450" height="35" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>`

    return html
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment } = atts
    let classes = 'vce-facebook-like'
    let innerClasses = 'vce-facebook-like-inner vce'
    let customProps = {}

    if (customClass) {
      classes += ` ${customClass}`
    }

    if (alignment) {
      classes += ` vce-facebook-like--align-${alignment}`
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
      <div className={innerClasses} ref='facebookLikeInner' id={'el-' + id}>Facebook Like</div>
    </div>
  }
}
