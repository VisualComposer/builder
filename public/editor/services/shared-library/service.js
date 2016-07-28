import vcCake from 'vc-cake'

let data = {}

const SharedLibrary = {
  add: (key, value) => {
    data[ key ] = value
  },
  get: (key) => {
    return data[ key ]
  },
  all: () => {
    return data
  }
}

SharedLibrary.add('colors', {
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
})

SharedLibrary.add('colors-dashed', {
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
})

vcCake.addService('shared-library', SharedLibrary)
