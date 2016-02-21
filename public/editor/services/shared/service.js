var SharedLibrary = {
  data: {},
  addData: function(key, value) {
    this.data[key] = value;
  },
  getData: function(key) {
    return this.data[key];
  },
  getAllData: function() {
    return this.data;
  }
};

SharedLibrary.addData('colors', {
  'Blue': 'blue',
  'Turquoise': 'turquoise',
  'Pink': 'pink',
  'Violet': 'violet',
  'Peacoc': 'peacoc',
  'Chino': 'chino',
  'Mulled Wine': 'mulled_wine',
  'Vista Blue': 'vista_blue',
  'Black': 'black',
  'Grey': 'grey',
  'Orange': 'orange',
  'Sky': 'sky',
  'Green': 'green',
  'Juicy pink': 'juicy_pink',
  'Sandy brown': 'sandy_brown',
  'Purple': 'purple',
  'White': 'white'
});

SharedLibrary.addData('colors-dashed', {
  'Blue': 'blue',
  'Turquoise': 'turquoise',
  'Pink': 'pink',
  'Violet': 'violet',
  'Peacoc': 'peacoc',
  'Chino': 'chino',
  'Mulled Wine': 'mulled-wine',
  'Vista Blue': 'vista-blue',
  'Black': 'black',
  'Grey': 'grey',
  'Orange': 'orange',
  'Sky': 'sky',
  'Green': 'green',
  'Juicy pink': 'juicy-pink',
  'Sandy brown': 'sandy-brown',
  'Purple': 'purple',
  'White': 'white'
});
var vcCake = require('vc-cake');

vcCake.addService('shared-library', SharedLibrary);
