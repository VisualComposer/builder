/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, width, alignment } = atts
    let classes = 'vce-google-fonts-heading vce'
    let customProps = {}
    let innerClasses = 'vce-google-fonts-heading-inner'
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (width) {
      innerCustomProps.style = this.state ? this.state.size : null
    }

    if (alignment) {
      classes += ` vce-google-fonts-heading--align-${alignment}`
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

    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <div className={innerClasses} {...innerCustomProps} />
    </div>
  }
}
