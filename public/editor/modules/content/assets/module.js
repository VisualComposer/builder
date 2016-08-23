import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')
const documentService = vcCake.getService('document')
const assetManager = vcCake.getService('assets-manager')

vcCake.add('assets', (api) => {
  api.reply('data:add', (element) => {
    addStyle(element)
  })

  api.reply('data:update', (id, element) => {
    let cookElement = cook.get(element)
    updateDesignOption(cookElement)
  })

  api.reply('data:beforeRemove', (id) => {
    let elements = []
    let walkChildren = (id) => {
      let element = documentService.get(id)
      elements.push(element)
      let children = documentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    removeStyles(elements)
    // todo: remove DO by id
  })

  api.reply('data:clone', (id) => {
    let elements = []
    let walkChildren = (id) => {
      let element = documentService.get(id)
      elements.push(element)
      // let desOpt = cook.get(element).get('designOptions')
      // console.log(desOpt)
      let children = documentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    addStyles(elements)
    assetManager.getCompiledCss().then((result) => {
      // console.log(result)
    })
    console.log(assetManager.getDesignOptions())
  })

  /**
   * @param element
   */
  function addStyle (element) {
    let cssSettings = cook.get(element).get('cssSettings')
    assetManager.add('styles', element.tag, cssSettings)
  }

  /**
   * @param elements
   */
  function addStyles (elements = []) {
    elements.forEach((element) => {
      addStyle(element)
    })
  }

  /**
   * @param element
   */
  function removeStyle (element) {
    assetManager.remove('styles', element.tag)
  }

  /**
   * @param elements
   */
  function removeStyles (elements = []) {
    elements.forEach((element) => {
      removeStyle(element)
    })
  }

  function updateDesignOption (element) {
    let designOptions = element.get('designOptions')
    console.log('DO', designOptions)
    assetManager.update('designOptions', element.id, designOptions)
  }
})
