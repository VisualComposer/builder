import vcCake from 'vc-cake'

class LocalStorage {
  static get dataKey () {
    return 'vcData'
  }

  static get cook () {
    return vcCake.getService('cook')
  }

  static update (data) {
    window.localStorage.setItem(LocalStorage.dataKey, JSON.stringify(data))
  }

  static getItem () {
    return JSON.parse(window.localStorage.getItem(LocalStorage.dataKey))
  }

  static reWrapDefaultContent (data) {
    let newData = {}
    Object.keys(data).forEach((k) => {
      newData[ k ] = data[ k ]
      newData[ k ].tag = LocalStorage.cook.getTagByName(newData[ k ].name)
    })
    return newData
  }
}
var defaultContent = { 'd18d1ab9': { 'name': 'Text block', 'output': '<h2><strong>BUILD ELEMENTS FROM TEMPLATES</strong></h2>', 'id': 'd18d1ab9', 'parent': '06d32eb8', 'order': 0 }, 'd97eeddd': { 'name': 'Text block', 'output': '<p>Try the new options for building Visual Composer content elements by using editing tool on the go or uploading your content elements directly into your editor.</p>', 'id': 'd97eeddd', 'parent': '8c0873c0', 'order': 1 }, '6cb94003': { 'name': 'Text block', 'output': '<h1><strong>THE NEW WAY TO BUILD ELEMENTS</strong></h1>', 'id': '6cb94003', 'parent': '8c0873c0', 'order': 0 }, '45dda6c3': { 'name': 'Text block', 'output': '<h2><strong>GETTING STARTED GUIDES AND TUTORIALS</strong></h2>', 'id': '45dda6c3', 'parent': 'e8df3956', 'order': 0 }, 'd3518cc5': { 'name': 'Column', 'background': '', 'size': '1-12', 'type': 'container', 'id': 'd3518cc5', 'parent': 'a53be680', 'order': 0.2 }, 'b2997584': { 'name': 'Text block', 'output': '<p>A step by step guides and tutorials will allow you creating or adapting elements for new Visual Composer. Become a rising star of the new WordPress era.</p>', 'id': 'b2997584', 'parent': 'e8df3956', 'order': 1 }, 'cc355805': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': 'cc355805', 'parent': 'a53be680', 'order': 0 }, 'a53be680': { 'name': 'Row', 'background': '', 'type': 'container', 'id': 'a53be680', 'parent': false, 'order': 0 }, '5bc6edf5': { 'name': 'Row', 'background': '', 'type': 'container', 'id': '5bc6edf5', 'parent': false, 'order': 2 }, 'de05a60e': { 'name': 'Text block', 'output': '<p>You don&rsquo;t have to create your elements from scratch. Use already available root elements as a basis to quickly create your own elements or learn on the go.</p>', 'id': 'de05a60e', 'parent': '06d32eb8', 'order': 0.5 }, '23f9b57d': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': '23f9b57d', 'parent': '5bc6edf5', 'order': 0.30000000000000004 }, '1325288b': { 'name': 'Text block', 'output': '<h2><strong>ONLINE EDITOR AND UPLOAD OPTIONS</strong></h2>', 'id': '1325288b', 'parent': '23f9b57d', 'order': 0 }, '8b9720a3': { 'name': 'Single Image', 'image': 'http://alpha.visualcomposer.io/wp-content/uploads/2016/05/hero.png', 'id': '8b9720a3', 'parent': 'cc355805', 'order': 0 }, 'e8c8c797': { 'name': 'Text block', 'output': '<p>Use Visual Composer Online Editor to create elements within our environment and instantly see preview. Or simply upload your content elements via smart element uploader.</p>', 'id': 'e8c8c797', 'parent': '23f9b57d', 'order': 1 }, '8c0873c0': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': '8c0873c0', 'parent': 'a53be680', 'order': 1.2 }, 'e8df3956': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': 'e8df3956', 'parent': '5bc6edf5', 'order': 0.7000000000000001 }, '06d32eb8': { 'name': 'Column', 'background': '', 'size': 'auto', 'type': 'container', 'id': '06d32eb8', 'parent': '5bc6edf5', 'order': 0 } }

var service = {
  save: function (data) {
    LocalStorage.update(data)
  },
  get: () => {
    var savedContent = LocalStorage.getItem() || {}
    return Object.keys(savedContent).length ? savedContent : LocalStorage.reWrapDefaultContent(defaultContent)
  }
}

vcCake.addService('local-storage', service)
