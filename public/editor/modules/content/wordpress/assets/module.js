var vcCake = require('vc-cake');

/**
 * Get all unique elements on page (their tag names) and remove all orphaned assets
 */
vcCake.add('asset-manager', function(api) {
  api.reply('data:add', function(element) {
    let elementTag = element.tag.toString();

    if (typeof(this.cache.scripts[elementTag]) !== 'undefined') {
      this.addScripts(elementTag, this.cache.scripts[elementTag]);
    }

    if (typeof(this.cache.styles[elementTag]) !== 'undefined') {
      this.addStyles(elementTag, this.cache.styles[elementTag]);
    }
  });
  api.reply('data:remove', function(id) {
    let document = Mediator.getService('data').getDocument();
    let assetTypes = ['scripts', 'styles'];
    let elements = document.getElementsByTagName('*');
    let tagNames = [];

    for (let i = elements.length - 1; i >= 0; i--) {
      if (tagNames.indexOf(elements[i].nodeName) === -1) {
        tagNames.push(elements[i].nodeName);
      }
    }

    for (let i = assetTypes.length - 1; i >= 0; i--) {
      let assets = this.getAssets(assetTypes[i]);

      for (let element in assets) {
        if (tagNames.indexOf(element) === -1) {
          delete assets[element];
        }
      }

      this.assets[assetTypes[i]] = assets;
    }
  });
});