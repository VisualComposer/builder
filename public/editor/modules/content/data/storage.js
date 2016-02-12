var vcCake = require('vc-cake');

vcCake.add('storage', function(api){
  var data = api.getService('data');
  api.reply('app:add', function (id) {
    if (id) {
      data.activeNode = DataStore.get(id);
    }
  });

  Data.subscribe('data:add', function (element) {
    data.add(element);
  });
  Data.subscribe('data:remove', function (id) {
    data.remove(id);
  });
  Data.subscribe('data:clone', function (id) {
    data.clone(id);
  });
  Data.subscribe('data:mutate', function (element) {
    Data.mutate(element);
  });
  Data.subscribe('data:move', function (id, beforeId) {
    Data.move(id, beforeId);
  });
  Data.subscribe('data:moveTo', function (srcElId, nextElId, parentId) {
    Data.moveTo(srcElId, nextElId, parentId);
  });
});
