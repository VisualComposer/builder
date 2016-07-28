var vcCake = require('vc-cake')

/**
 * Get all unique elements on page (their tag names) and remove all orphaned assets
 */
vcCake.add('content-wordpress-assets', function (api) {
  var assetManager = vcCake.getService('assets-manager')
  api.reply('data:add', function (element) {
    let elementTag = element.tag
    if (typeof assetManager.cache.scripts[ elementTag ] !== 'undefined') {
      assetManager.addScripts(elementTag, assetManager.cache.scripts[ elementTag ])
    }
    if (typeof assetManager.cache.styles[ elementTag ] !== 'undefined') {
      assetManager.addStyles(elementTag, assetManager.cache.styles[ elementTag ])
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
   let assets = assetManager.getAssets(assetTypes[i])

   for (let element in assets) {
   if (tagNames.indexOf(element) === -1) {
   delete assets[element]
   }
   }

   assetManager.assets[assetTypes[i]] = assets
   }
   })*/
})
