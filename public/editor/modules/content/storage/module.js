var vcCake = require('vc-cake');
vcCake.add('storage', function(api) {
  var documentData = api.getService('document');
  api.reply('data:add', function(element) {
    documentData.create(element);
    api.request('data:changed', documentData.children(false), 'add');
  });
  api.reply('data:remove', function(id) {
    documentData.delete(id);
    api.request('data:changed', documentData.children(false), 'remove');
  });
  api.reply('data:clone', function(id) {
    documentData.clone(id);
    api.request('data:changed', documentData.children(false), 'clone');
  });
  api.reply('data:update', function(id, element) {
    documentData.update(id, element);
    api.request('data:changed', documentData.children(false), 'update');
  });
  api.reply('data:move', function(id, action, related) {
    if ('after' === action) {
      documentData.moveAfter(id, related);
    } else if ('append' === action) {
      documentData.prependTo(id, related);
    } else {
      documentData.moveBefore(id, related);
    }
    api.request('data:changed', documentData.children(false));
  });
  api.reply('data:reset', function(content) {
    documentData.reset(content || {});
    api.request('data:changed', documentData.children(false), 'reset');
  });
});
