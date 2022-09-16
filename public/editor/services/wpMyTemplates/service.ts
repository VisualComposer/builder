import { addService, getService, getStorage, env } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const utils = getService('utils')
const dataManager = getService('dataManager')
const getType = {}.toString
const editorType = dataManager.get('editorType')

interface Template {
  bundle?: string,
  description?: string,
  id: string,
  name: string,
  preview?: string,
  thumbnail?: string,
  type: string,
  usageCount: number
}

interface TemplateType {
  name: string,
  templates: Template,
  type: string
}

interface HubTemplates {
  [item:string]: TemplateType
}

// disabling lint, because response can be a template object with different properties
type Callback = (response:any) => void // eslint-disable-line
type SortCallback = (a:Template, b:Template) => number
type FilterCallback = (item:Template, index:number) => Template[]

const processRequest = (action:string, key:string, id:string, successCallback:Callback, errorCallback:Callback) => {
  const ajax = getService('utils').ajax

  return ajax({
    'vcv-action': `editorTemplates:${action}:adminNonce`,
    'vcv-nonce': dataManager.get('nonce'),
    'vcv-source-id': dataManager.get('sourceID'),
    [key]: id
  }, (result:{response:string}) => {
    const response = getResponse(result.response)
    if (response && response.status) {
      successCallback && typeof successCallback === 'function' && successCallback(response)
    } else {
      errorCallback && typeof errorCallback === 'function' && errorCallback(response)
    }
  }, errorCallback)
}

addService('myTemplates', {
  // disabling lint, because data can be a template object with different properties
  add (name:string, data:any, html:string, successCallback:() => void, errorCallback:() => void, isElementLayout = false, templateType:string) { // eslint-disable-line
    if (this.findBy('name', name)) {
      return false
    }
    const templateTypeId = templateType || 'template'
    getStorage('wordpressData').trigger('save', {}, '', {
      id: templateTypeId,
      title: name,
      status: false,
      documentData: isElementLayout ? data : false,
      successCallback: (responseText:string) => {
        try {
          const response = getResponse(responseText)
          if (!response.status || !response.postData || !response.postData.id) {
            console.warn('Failed to save template, no ID', responseText)
            errorCallback && typeof errorCallback === 'function' && errorCallback()
          } else {
            const id = response.postData.id
            const templateData = { id: id.toString(), name: name, data: data, html: html }
            const templateGroup = response.templateGroup
            getStorage('hubTemplates').trigger('add', templateGroup.type, templateData, templateGroup)
            successCallback && typeof successCallback === 'function' && successCallback()
          }
        } catch (e) {
          console.warn('Failed to save template', e, responseText)
          errorCallback && typeof errorCallback === 'function' && errorCallback()
        }
      },
      errorCallback: () => {
        errorCallback && typeof errorCallback === 'function' && errorCallback()
      }
    })

    return true
  },
  addElementTemplate (id:string, name:string, successCallback:() => void, errorCallback:() => void, templateType:string) {
    const documentManager = getService('document')
    const currentLayout = documentManager.getDescendants(id)
    const elementsStorage = getStorage('elements')
    const htmlStrings = elementsStorage.state('htmlStrings').get()
    const currentLayoutHtml = htmlStrings[id] || ''
    currentLayout[id].parent = false
    if (getType.call(name) === '[object String]' && name.length) {
      return this.add(name, currentLayout, currentLayoutHtml, successCallback, errorCallback, true, templateType)
    }
    return false
  },
  addCurrentLayout (name:string, successCallback:() => void, errorCallback:() => void) {
    const documentManager = getService('document')
    const currentLayout = documentManager.all()
    const iframe = document.getElementById('vcv-editor-iframe') as HTMLIFrameElement
    const contentLayout = iframe ? iframe?.contentWindow?.document.querySelector('[data-vcv-module="content-layout"]') : false
    const currentLayoutHtml = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''
    if (getType.call(name) === '[object String]' && name.length) {
      const templateType = 'template'
      return this.add(name, currentLayout, currentLayoutHtml, successCallback, errorCallback, false, templateType)
    }
    return false
  },
  remove (id:string, type:string, successCallback:(response:{status: boolean, message: string}) => void, errorCallback:() => void) {
    processRequest('delete', 'vcv-template-id', id, (response) => {
      getStorage('hubTemplates').trigger('remove', type, id)
      successCallback && typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  },
  // disabling lint, because data and allData can be a template object with different properties
  load (id:string, successCallback:(response:{status: boolean, data: any, allData: any}) => void, errorCallback:() => void) { // eslint-disable-line
    processRequest('read', 'vcv-template-id', id, (response) => {
      successCallback && typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  },
  get (id:string) {
    const myTemplates = this.all()
    return myTemplates.find((template:{id:string}) => {
      return template.id === id
    })
  },
  findBy (key:string, value:string) {
    return this.getAllTemplates().find((template:{[item:string]: string|boolean}) => {
      return template[key] && template[key] === value
    })
  },
  all (filter:FilterCallback, sort:SortCallback, data:HubTemplates) {
    const storageData = getStorage('hubTemplates').state('templates').get()
    let custom
    if (data && data.custom) {
      custom = data.custom
    } else {
      custom = storageData && storageData.custom ? storageData.custom : false
    }
    let myTemplates = custom && custom.templates ? custom.templates : []
    if (env('VCV_JS_THEME_EDITOR')) {
      const customHeader = this.customHeader(data)
      const customFooter = this.customFooter(data)
      const customSidebar = this.customSidebar(data)
      const customHeaderTemplates = customHeader && customHeader.templates ? customHeader.templates : []
      const customFooterTemplates = customFooter && customFooter.templates ? customFooter.templates : []
      const customSidebarTemplates = customSidebar && customSidebar.templates ? customSidebar.templates : []

      myTemplates = myTemplates.concat(customHeaderTemplates, customFooterTemplates, customSidebarTemplates)
    }

    if (editorType === 'popup') {
      const customPopup = this.getPopupTemplates(data)
      const customPopupTemplates = customPopup && customPopup.templates ? customPopup.templates : []
      myTemplates.concat(customPopupTemplates)
    }

    if (filter && filter.constructor === Function) {
      myTemplates = myTemplates.filter(filter)
    }
    if (sort && sort.constructor === Function) {
      myTemplates.sort(sort)
    } else {
      myTemplates.sort((a:{name:string}, b:{name:string}) => {
        // @ts-ignore locales argument can be string, array or object
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#parameters
        return a.name ? a.name.localeCompare(b.name, { kn: true }, { sensitivity: 'base' }) : -1
      })
    }
    return myTemplates
  },
  predefined (data:TemplateType) {
    const predefinedTemplates = data || getStorage('hubTemplates').state('templates').get().predefined
    return predefinedTemplates && predefinedTemplates.templates ? predefinedTemplates.templates : []
  },
  hub (data:TemplateType) {
    const hubTemplates = data || getStorage('hubTemplates').state('templates').get().hub
    return hubTemplates && hubTemplates.templates ? hubTemplates.templates : []
  },
  findTemplateByBundle (bundle:string) {
    const allTemplates = getStorage('hubTemplates').state('templates').get() || {}
    delete allTemplates.custom
    let template = false
    const templatesTypes = Object.keys(allTemplates)
    for (let i = 0; i < templatesTypes.length; i++) {
      const type = templatesTypes[i]
      const hubTemplates = allTemplates[type] || []
      if (hubTemplates.templates) {
        template = hubTemplates.templates.find((hubTemplate:Template) => {
          return hubTemplate.bundle === bundle ? hubTemplate : false
        })
        if (template) {
          break
        }
      }
    }
    return template
  },
  hubAndPredefined (data: {hub:TemplateType, predefined:TemplateType}) {
    const hubAndPredefined = data && this.hub(data.hub).concat(this.predefined(data.predefined))
    return hubAndPredefined || []
  },
  hubHeader (data:TemplateType) {
    const hubHeaderTemplates = data
    return hubHeaderTemplates && hubHeaderTemplates.templates ? hubHeaderTemplates.templates : []
  },
  hubFooter (data:TemplateType) {
    const hubFooterTemplates = data
    return hubFooterTemplates && hubFooterTemplates.templates ? hubFooterTemplates.templates : []
  },
  hubSidebar (data:TemplateType) {
    const hubSidebarTemplates = data
    return hubSidebarTemplates && hubSidebarTemplates.templates ? hubSidebarTemplates.templates : []
  },
  hubBlock (data:TemplateType) {
    const hubBlockTemplates = data
    return hubBlockTemplates && hubBlockTemplates.templates ? hubBlockTemplates.templates : []
  },
  getPopupTemplates (data:TemplateType) {
    return data && data.templates ? data.templates : []
  },
  customHeader (data:{customHeader:TemplateType}) {
    const customHeaderTemplates = data && data.customHeader
    return customHeaderTemplates && customHeaderTemplates.templates ? customHeaderTemplates.templates : []
  },
  customFooter (data:{customFooter:TemplateType}) {
    const customFooterTemplates = data && data.customFooter
    return customFooterTemplates && customFooterTemplates.templates ? customFooterTemplates.templates : []
  },
  customSidebar (data:{customSidebar:TemplateType}) {
    const customSidebarTemplates = data && data.customSidebar
    return customSidebarTemplates && customSidebarTemplates.templates ? customSidebarTemplates.templates : []
  },
  getAllTemplates (filter:FilterCallback, sort:SortCallback, data:HubTemplates) {
    const allTemplatesGroups = data || getStorage('hubTemplates').state('templates').get()
    let allTemplates:Template[] = []
    for (const key in allTemplatesGroups) {
      allTemplates = allTemplates.concat(allTemplatesGroups[key].templates)
    }
    if (filter && filter.constructor === Function) {
      allTemplates = allTemplates.filter(filter)
    }
    if (sort && sort.constructor === Function) {
      allTemplates.sort(sort)
    } else {
      allTemplates.sort((a:{name:string}, b:{name:string}) => {
        // @ts-ignore locales argument can be string, array or object
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#parameters
        return a.name ? a.name.localeCompare(b.name, { kn: true }, { sensitivity: 'base' }) : -1
      })
    }
    return allTemplates
  },
  getTemplateData () {
    return getStorage('hubTemplates').state('templates').get()
  },
  getLiteVersionTemplates () {
    // TODO get lite version templates from hub
    return this.getAllTemplates()
  }
})
