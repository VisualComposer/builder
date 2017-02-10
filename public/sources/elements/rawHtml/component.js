/* global React, vcvAPI */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { rawHtml, customClass, designOptions, metaCustomId } = atts // destructuring assignment for attributes from settings.json with access public
    let classes = 'vce-raw-html'
    let customProps = {}
    let wrapperClasses = 'vce-raw-html-wrapper'
    if (typeof customClass === 'string' && customClass) {
      classes = classes.concat(' ' + customClass)
    }
    let createMarkup = () => {
      return { __html: rawHtml }
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
      <div className={wrapperClasses} id={'el-' + id} dangerouslySetInnerHTML={createMarkup()} {...doAll} />
    </div>
  }
}
