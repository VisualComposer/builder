import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')
const documentService = vcCake.getService('document')
const assetManager = vcCake.getService('assets-manager')

vcCake.add('assets', (api) => {
  api.reply('data:add', (element) => {
    addStyle(element)
    console.log(assetManager.getDesignOptions())
  })

  api.reply('data:update', (id, element) => {
    updateDesignOption(element)
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
    removeDesignOptions(elements)
  })

  api.reply('data:afterClone', (id) => {
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
    addStyles(elements)
    updateDesignOptions(elements)
    // assetManager.getCompiledCss().then((result) => {
    //   // console.log(result)
    // })
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
    let designOptions = cook.get(element).get('designOptions')
    console.log('DO', designOptions)
    assetManager.update('designOptions', element.id, designOptions)
  }

  function updateDesignOptions (elements = []) {
    elements.forEach((element) => {
      updateDesignOption(element)
    })
  }

  function removeDesignOption (element) {
    assetManager.remove('designOptions', element.id)
  }

  function removeDesignOptions (elements = []) {
    elements.forEach((element) => {
      removeDesignOption(element)
    })
  }
})
