export const addRowColumnBackground = (id, colSettings, parentId, documentManager, elementsStorage) => {
  const rowSettings = documentManager.get(parentId)
  const rowChildren = documentManager.children(parentId)

  const columnBackgrounds = []

  const pushBackground = (element) => {
    const designOptions = element.designOptionsAdvanced
    let backgroundUsed = false
    const elementBackground = {}
    if (designOptions && designOptions.device) {
      let hasDeviceSettings = false

      for (const prop in designOptions.device) {
        if (Object.prototype.hasOwnProperty.call(designOptions.device, prop)) {
          hasDeviceSettings = true
        }
      }

      if (!hasDeviceSettings) {
        return
      }

      if (Object.prototype.hasOwnProperty.call(designOptions.device, 'all')) {
        const allSettings = designOptions.device.all
        if (allSettings.backgroundColor || typeof allSettings.images === 'string' || (allSettings.images && allSettings.images.urls && allSettings.images.urls.length)) {
          elementBackground.all = true
          backgroundUsed = true
        }
      } else {
        for (const device in designOptions.device) {
          if (Object.prototype.hasOwnProperty.call(designOptions.device, device)) {
            const deviceSettings = designOptions.device[device]
            if (deviceSettings.backgroundColor || typeof deviceSettings.images === 'string' || (deviceSettings.images && deviceSettings.images.urls && deviceSettings.images.urls.length)) {
              elementBackground[device] = true
              backgroundUsed = true
            }
          }
        }
      }

      if (backgroundUsed) {
        columnBackgrounds.push(elementBackground)
      }
    }
  }

  rowChildren.forEach((column) => {
    if (colSettings && column.id === colSettings.id) {
      pushBackground(colSettings)
    } else {
      pushBackground(column)
    }
  })

  rowSettings.columnBackground = columnBackgrounds.reduce((result, currentObject) => {
    for (const key in currentObject) {
      if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
        result[key] = currentObject[key]
      }
    }
    return result
  }, {})

  window.setTimeout(() => {
    documentManager.update(rowSettings.id, rowSettings)
    elementsStorage.trigger('update', parentId, rowSettings, '', { silent: true })
  }, 0)
}
