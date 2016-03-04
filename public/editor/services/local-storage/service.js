var vcCake = require('vc-cake');

var localStorage = {
  dataKey: 'vcData',
  update: function(data) {
    window.localStorage.setItem(this.dataKey, JSON.stringify(data));
  },
  getItem: function() {
    return JSON.parse(window.localStorage.getItem(this.dataKey));
  }
};

var service = {
  save: function(data) {
    localStorage.update(data);
  },
  get: function() {
  	return localStorage.getItem();
  }
};

vcCake.addService('local-storage', service);
