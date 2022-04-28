/* global describe, test, expect */
import vcCake from 'vc-cake'

import '../../public/editor/services/dataManager/service.js'
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/document/service.js'

const elementData = {
  "id": "2bbae7c5",
  "order": 0,
  "parent": "e262f4e6",
  "tag": "basicButton",
  "customHeaderTitle": "",
  "metaAssetsPath": "http://localhost:8888/vcwb/wp-content/plugins/builder/elements/basicButton/basicButton/public/",
  "hidden": false,
  "metaElementAssets": {},
  "metaIsElementLocked": false,
  "buttonUrl": {
    "url": "",
    "title": "",
    "targetBlank": false,
    "relNofollow": false
  },
  "toggleCustomHover": false,
  "hoverColor": "#fff",
  "hoverBackground": "#4d70ac",
  "buttonText": "Apply Now",
  "color": "#fff",
  "background": "#557cbf",
  "shape": "square",
  "designOptions": {},
  "assetsLibrary": [
    "animate"
  ],
  "alignment": "left",
  "size": "medium",
  "toggleStretchButton": false,
  "customClass": "",
  "metaCustomId": ""
}
const updatedElementData = {
  "id": "2bbae7c5",
  "order": 0,
  "parent": "e262f4e6",
  "tag": "basicButton",
  "customHeaderTitle": "",
  "metaAssetsPath": "http://localhost:8888/vcwb/wp-content/plugins/builder/elements/basicButton/basicButton/public/",
  "hidden": false,
  "metaElementAssets": {},
  "metaIsElementLocked": false,
  "buttonUrl": {
    "url": "",
    "title": "",
    "targetBlank": false,
    "relNofollow": false
  },
  "toggleCustomHover": false,
  "hoverColor": "#fff",
  "hoverBackground": "#4d70ac",
  "buttonText": "Apply Now",
  "color": "#fff",
  "background": "#557cbf",
  "shape": "round",
  "designOptions": {
    "device": {
      "all": {
        "lazyLoad": true
      }
    }
  },
  "assetsLibrary": [
    "animate"
  ],
  "alignment": "center",
  "size": "large",
  "toggleStretchButton": false,
  "customClass": "",
  "metaCustomId": ""
}

describe('Test documentService', () => {
  const documentManager = vcCake.getService('document')
  documentManager.create(elementData)
  test('Expect created element data to match provided element data', () => {
    const expectedElement = documentManager.get(elementData.id)
    expect(elementData).toStrictEqual(expectedElement)
  })
  test('Expect updated element data to match provided element data', () => {
    const newAttributes = {
      "shape": "round",
      "alignment": "center",
      "size": "large",
      "designOptions": {
        "device": {
          "all": {
            "lazyLoad": true
          }
        }
      }
    }
    documentManager.update(elementData.id, newAttributes)
    // Check if this doesnt mutate the data by reference
    newAttributes.shape = 'square'
    const updatedElement = documentManager.get(elementData.id)
    expect(updatedElementData).toStrictEqual(updatedElement)
  })
  test('Expect element to be cloned', () => {
    documentManager.clone(elementData.id)
    Object.keys(documentManager.all()).forEach((key) => {
      console.log(key, documentManager.all()[key]);
    });
  })
  test('Expect deleted element to not be available', () => {
    documentManager.delete(elementData.id)
    expect(documentManager.get(elementData.id)).toBe(null)
  })
})
