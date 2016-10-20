let classes = ['vce-row']
let customProps = {}
const classNames = require('classnames')
// reverse classes.push('vce-row-wrap--reverse')
if (typeof customClass === 'string' && customClass) {
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
if (animations.length) {
  customProps[ 'data-vce-animate' ] = animations.join(' ')
}