import vcCake from 'vc-cake'

/**
 * Get all unique elements on page (their tag names) and remove all orphaned assets
 */
vcCake.add('content-wordpress-assets', (api) => {
  const AssetsManager = vcCake.getService('assets-manager')
  api.reply('data:add', (element) => {
    let elementTag = element.tag
    if (typeof AssetsManager.cache.scripts[ elementTag ] !== 'undefined') {
      AssetsManager.addScripts(elementTag, AssetsManager.cache.scripts[ elementTag ])
    }
    if (typeof AssetsManager.cache.styles[ elementTag ] !== 'undefined') {
      AssetsManager.addStyles(elementTag, AssetsManager.cache.styles[ elementTag ])
    }
  })
  /*
   api.reply('data:remove', function(id) {
   let document = vcCake.getService('document').all()
   let assetTypes = ['scripts', 'styles']
   let tagNames = []

   for (let i = data.length - 1 i >= 0 i--) {
   tagNames.push(elements[i].get('name'))
   }

   for (let i = assetTypes.length - 1 i >= 0 i--) {
   let assets = AssetsManager.getAssets(assetTypes[i])

   for (let element in assets) {
   if (tagNames.indexOf(element) === -1) {
   delete assets[element]
   }
   }

   AssetsManager.assets[assetTypes[i]] = assets
   }
   })*/
})
