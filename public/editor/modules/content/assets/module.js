import vcCake from 'vc-cake'

const DocumentService = vcCake.getService('document')
const AssetManager = vcCake.getService('assets-manager')

vcCake.add('assets', (api) => {
  // api.module('content-layout').on('element:mount', (id) => {
  //  AssetManager.add(id)
  api.reply('data:afterAdd', (ids) => {
    AssetManager.add(ids)
    AssetManager.getCompiledCss().then((result) => {
      console.log(result)
    })
  })

  api.reply('data:afterUpdate', (id, element) => {
    AssetManager.update(id)
  })

  api.reply('data:beforeRemove', (id) => {
    let elements = []
    let walkChildren = (id) => {
      elements.push(id)
      let children = DocumentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    AssetManager.remove(elements)
  })

  api.reply('data:afterClone', (id) => {
    let elements = []
    let walkChildren = (id) => {
      elements.push(id)
      let children = DocumentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    AssetManager.add(elements)
  })
})
