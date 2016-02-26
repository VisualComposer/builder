var vcCake = require('vc-cake');
vcCake.add('storage', function(api) {
    var data = api.getService('document');
    api.reply('data:add', function(element) {
      data.create(element);
      api.request('data:changed', data.children(false), 'add');
    });
    api.reply('data:remove', function(id) {
      data.delete(id);
      api.request('data:changed', data.children(false), 'remove');
    });
    api.reply('data:clone', function(id) {
      data.clone(id);
      api.request('data:changed', data.children(false), 'clone');
    });
    api.reply('data:update', function(id, element) {
      data.update(id, element);
      api.request('data:changed', data.children(false), 'update');
    });
  /*
    api.reply('data:move', function(id, beforeId) {
      data.move(id, beforeId);
      api.request('data:changed', data.children(false));
    });
    api.reply('data:moveTo', function(srcElId, nextElId, parentId) {
      Data.moveTo(srcElId, nextElId, parentId);
    });
    */
    api.reply('data:reset', function(content){
      data.reset(content || {});
      api.request('data:changed', data.children(false), 'reset');
    });
});
