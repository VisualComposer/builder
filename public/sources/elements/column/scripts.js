const classNames = require('classnames')
let customProps = {}

let classes = ['vce-col', 'vce-col--xs-1']
classes.push('vce-col--sm-' + (size ? size.replace('/', '-') : 'auto'))
// reverse classes.push('vce-row-wrap--reverse')
if (typeof customClass === 'string' && customClass.length) {
  classes.push(customClass)
}

classes = classes.concat(vcvAPI.getDesignOptionsCssClasses(designOptions))


let className = classNames(classes)

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
if (animations) {
  customProps[ 'data-vce-animate' ] = animations.join(' ')
}