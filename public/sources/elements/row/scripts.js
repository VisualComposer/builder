let classes = ['vce-row']
const classNames = require('classnames')
// reverse classes.push('vce-row-wrap--reverse')
if (typeof customClass === 'string' && customClass) {
  classes.push(customClass)
}

if (!(Object.keys(designOptions).length === 0 && designOptions.constructor === Object) && designOptions.used) {
  if (designOptions.deviceTypes === 'all' && (designOptions.all.backgroundColor !== '' || designOptions.all.backgroundImage.urls.length)) {
    classes.push('vce-row--has-background')
  } else {
    let devices = {
      'desktop': 'xl',
      'tablet-landscape': 'lg',
      'tablet-portrait': 'md',
      'mobile-landscape': 'sm',
      'mobile-portrait': 'xs'
    }
    for (let device in devices) {
      if ((designOptions[ device ].backgroundColor !== '' || designOptions[ device ].backgroundImage.urls.length)) {
        classes.push('vce-row--' + devices[ device ] + '--has-background')
      }
    }
  }
}

let className = classNames(classes)
