import vcCake from 'vc-cake'

vcCake.getStorage('history').state('canUndo').onChange(() => {
  console.log('can undo')
})
