var vcCake = require('vc-cake');
vcCake.add('storage', function(api) {
    var data = api.getService('document');
/*    api.reply('data:add', function(element) {
      data.create(element);
      api.request('data:changed', data.children(false));
    });*/
    api.reply('data:remove', function(id) {
      data.delete(id);
      api.request('data:changed', data.children(false));
    });
    api.reply('data:clone', function(id) {
      data.clone(id);
      api.request('data:changed', data.children(false));
    });
    api.reply('data:mutate', function(id, element) {
      data.update(id, element);
      api.request('data:changed', data.children(false));
    });
    api.reply('data:move', function(id, beforeId) {
      Data.move(id, beforeId);
      api.request('data:changed', data.children(false));
    });
    api.reply('data:moveTo', function(srcElId, nextElId, parentId) {
      Data.moveTo(srcElId, nextElId, parentId);
    });
    api.request('data:changed', data.children(false));
});
