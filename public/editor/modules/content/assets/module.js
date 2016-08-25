import vcCake from 'vc-cake'

const documentService = vcCake.getService('document')
const assetManager = vcCake.getService('assets-manager')

vcCake.add('assets', (api) => {
  api.reply('data:afterAdd', (ids) => {
    assetManager.add(ids)
    // assetManager.getCompiledCss().then((result) => {
    //   console.log(result)
    // })
  })

  api.reply('data:afterUpdate', (id, element) => {
    assetManager.update(id)
    // assetManager.getCompiledDesignOptions().then((result) => {
    //   console.log(result)
    // })
    // console.log(assetManager.get())
    // assetManager.getCompiledCss().then((result) => {
    //   console.log(result)
    // })
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
