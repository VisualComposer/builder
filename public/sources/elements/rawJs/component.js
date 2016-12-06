/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.props.editor && this.updateJsScript(this.props.atts.rawJs)
  }
  componentWillReceiveProps (nextProps) {
    this.props.editor && this.updateJsScript(nextProps.atts.rawJs)
  }
  updateJsScript (rawJs) {
    let component = this.refs.rawJsWrapper
    component.innerHTML = ''
    let script = document.createElement('script')
    script.innerText = rawJs
    component.appendChild(script)
  }
  render () {
    var {id, atts, editor} = this.props
    var {customClass, rawJs, designOptions} = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js-container'
    let customProps = {}
    let wrapperClasses = 'vce-raw-js-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
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

    return <div className={classes} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id} ref='rawJsWrapper'>
        <script>{rawJs}</script>
      </div>
    </div>
  }

}
