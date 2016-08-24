import vcCake from 'vc-cake'

const documentService = vcCake.getService('document')
const assetManager = vcCake.getService('assets-manager')

vcCake.add('assets', (api) => {
  api.module('content-layout').on('element:mount', (id) => {
    assetManager.add(id)
    assetManager.getCompiledCss().then((result) => {
      console.log(result)
    })
  })

  api.reply('data:afterUpdate', (id, element) => {
    assetManager.update(id)
  })

  api.reply('data:beforeRemove', (id) => {
    let elements = []
    let walkChildren = (id) => {
      elements.push(id)
      let children = documentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    assetManager.remove(elements)
  })

  api.reply('data:afterClone', (id) => {
    let elements = []
    let walkChildren = (id) => {
      elements.push(id)
      let children = documentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    assetManager.add(elements)
  })
})
