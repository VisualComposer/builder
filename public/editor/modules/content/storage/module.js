var vcCake = require('vc-cake');
vcCake.add('storage', function(context) {
    var data = api.getService('data');
    api.reply('app:add', function(id) {
      if (id) {
        data.activeNode = DataStore.get(id);
      }
    });
    api.reply('data:add', function(element) {
      data.add(element);
    });
    api.reply('data:remove', function(id) {
      data.remove(id);
    });
    api.reply('data:clone', function(id) {
      data.clone(id);
    });
    api.reply('data:mutate', function(element) {
      Data.mutate(element);
    });
    api.reply('data:move', function(id, beforeId) {
      Data.move(id, beforeId);
    });
    api.reply('data:moveTo', function(srcElId, nextElId, parentId) {
      Data.moveTo(srcElId, nextElId, parentId);
    });
    api.reply('data:changed');
});
