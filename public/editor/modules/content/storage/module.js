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
  api.reply('data:move', function(id, data) {
    if ('after' === data.action) {
      documentData.moveAfter(id, data.related);
    } else if ('append' === data.action) {
      documentData.appendTo(id, data.related);
    } else {
      documentData.moveBefore(id, data.related);
    }
    api.request('data:changed', documentData.children('false'));
  });
  api.reply('data:reset', function(content) {
    documentData.reset(content || {});
    api.request('data:changed', documentData.children('false'), 'reset');
  });
});
