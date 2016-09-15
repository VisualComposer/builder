const classNames = require('classnames')

let classes = ['vce-col', 'vce-col--xs-1']
classes.push('vce-col--sm-' + (size ? size.replace('/', '-') : 'auto'))
// reverse classes.push('vce-row-wrap--reverse')
if (typeof customClass === 'string' && customClass.length) {
  classes.push(customClass)
}

if (!(Object.keys(designOptions).length === 0 && designOptions.constructor === Object) && designOptions.used) {
  if (designOptions.deviceTypes === 'all' && (designOptions.all.backgroundColor !== '' || designOptions.all.backgroundImage.urls.length)) {
    classes.push('vce-col--has-background')
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
        classes.push('vce-col--' + devices[ device ] + '--has-background')
      }
    }
  }
}

let className = classNames(classes)