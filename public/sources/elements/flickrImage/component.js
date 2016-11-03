/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.updateInlineHtml(this.props.atts.embed)
  }

  componentWillReceiveProps (nextProps) {
    this.updateInlineHtml(nextProps.atts.embed)
  }
  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment } = atts
    let classes = 'vce-flickr-image vce'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-flickr-image--align-${alignment}`
    }

    customProps.key = `customProps:${id}`

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

    if (editor) {
      classes += ' vce-instagram-image-disabled'
    }

    return <div {...customProps} className={classes} id={'el-' + id} {...editor} />
  }
}
