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
    let { id, atts, editor } = this.props
    let { customClass, rawJs, designOptions, metaCustomId } = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-js-container'
    let customProps = {}
    let wrapperClasses = 'vce-raw-js-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
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

    return <div className={classes} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id} ref='rawJsWrapper' {...doAll}>
        <script>{rawJs}</script>
      </div>
    </div>
  }

}
