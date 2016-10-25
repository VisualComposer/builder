/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    let { id, atts, editor } = this.props
    let { embed, designOptions, customClass, alignment } = atts
    let classes = 'vce-tweet-button vce'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-tweet-button--align-${alignment}`
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
    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <a href="https://twitter.com/share" className="twitter-share-button" data-show-count="false">Tweet</a>
    </div>
  }
}
