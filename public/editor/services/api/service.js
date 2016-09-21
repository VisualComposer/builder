import vcCake from 'vc-cake'
const Service = {
  getDesignOptionsCssClasses: function (designOptions) {
    let classes = []
    if (!(Object.keys(designOptions).length === 0 && designOptions.constructor === Object) && designOptions.used) {
      if (designOptions.deviceTypes === 'all' && (designOptions.all.backgroundColor !== '' || designOptions.all.backgroundImage.urls.length)) {
        classes.push('vce-element--has-background')
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
            classes.push('vce-element--' + devices[ device ] + '--has-background')
          }
        }
      }
    }
    return classes
  }
}
vcCake.addService('api', Service)
