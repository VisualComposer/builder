/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.checkCustomSize = this.checkCustomSize.bind(this)
  }
  componentDidMount () {
    if (this.props.atts.size) {
      this.checkCustomSize(this.props.atts.size)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.size) {
      this.checkCustomSize(nextProps.atts.size)
    } else {
      this.setState({
        imgSize: null
      })
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { embed, designOptions, customClass, size, alignment } = atts
    let classes = 'vce-google-maps vce'
    let innerClasses = 'vce-google-maps-inner'
    let wrapperClasses = 'vce-google-maps-wrapper'
    let customProps = {}
    let innerProps = {}
    let wrapperProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (typeof size === 'string' && size) {
      wrapperProps.style = { maxWidth: this.state ? (this.state.imgSize ? this.state.imgSize.maxWidth : null) : null }
      innerProps.style = { paddingBottom: this.state ? (this.state.imgSize ? this.state.imgSize.paddingBottom : null) : null }
      wrapperClasses += ` vce-google-maps--size-custom`
    }

    if (alignment) {
      classes += ` vce-google-maps--align-${alignment}`
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
      <div {...wrapperProps} className={wrapperClasses}>
        <div className={innerClasses} {...innerProps} dangerouslySetInnerHTML={{__html:embed}} />
      </div>
  </div>
  }

  checkCustomSize (size) {
    size = size.toLowerCase().split(' ').join('')

    if (size.match(/\d*(x)\d*/)) {
      size = size.split('x')
      size = {
        width: size[0],
        height: size[1]
      }
    } else {
      switch (size) {
        case 'thumbnail':
          size = {
            width: 150,
            height: 150
          }
          break
        case 'medium':
          size = {
            width: 300,
            height: 225
          }
          break
        case 'large':
          size = {
            width: 660,
            height: 500
          }
          break
        case 'full':
          size = null
          break
        default:
          size = {
            width: 600,
            height: 450
          }
      }
    }
    this.setSizeState(size)
  }

  setSizeState (size) {
    this.setState({
      imgSize: {
        maxWidth: size ? size.width + 'px' : null,
        paddingBottom: size ? size.height / size.width * 100 + '%' : null
      }
    })
  }
}
