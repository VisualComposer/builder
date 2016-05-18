var vcCake = require('vc-cake')

var localStorage = {
  dataKey: 'vcData',
  update: function (data) {
    window.localStorage.setItem(this.dataKey, JSON.stringify(data))
  },
  getItem: function () {
    return JSON.parse(window.localStorage.getItem(this.dataKey))
  }
}

var service = {
  save: function (data) {
    localStorage.update(data)
  },
  get: function () {
    return { 'd18d1ab9': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<h2><strong>BUILD ELEMENTS FROM TEMPLATES</strong></h2>', 'id': 'd18d1ab9', 'parent': '06d32eb8', 'order': 0 }, 'd97eeddd': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<p>Try the new options for building Visual Composer content elements by using editing tool on the go or uploading your content elements directly into your editor.</p>', 'id': 'd97eeddd', 'parent': '8c0873c0', 'order': 1 }, '6cb94003': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<h2><strong>THE NEW WAY TO BUILD ELEMENTS</strong></h2>', 'id': '6cb94003', 'parent': '8c0873c0', 'order': 0 }, '45dda6c3': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<h2><strong>GETTING STARTED GUIDES AND TUTORIALS</strong></h2>', 'id': '45dda6c3', 'parent': 'e8df3956', 'order': 0 }, 'd3518cc5': { 'name': 'Column', 'background': '', 'size': '1-12', 'tag': '3254e27e-49f8-4af6-993f-9f8b49f019ea', 'type': 'container', 'id': 'd3518cc5', 'parent': 'a53be680', 'order': 0.2 }, 'b2997584': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<p>A step by step guides and tutorials will allow you creating or adapting elements for new Visual Composer. Become a rising star of the new WordPress era.</p>', 'id': 'b2997584', 'parent': 'e8df3956', 'order': 1 }, 'cc355805': { 'name': 'Column', 'background': '', 'size': 'auto', 'tag': '3254e27e-49f8-4af6-993f-9f8b49f019ea', 'type': 'container', 'id': 'cc355805', 'parent': 'a53be680', 'order': 0 }, 'a53be680': { 'name': 'Row', 'background': '', 'tag': '18a95a2e-c0d5-428b-ac11-b2eea788b221', 'type': 'container', 'id': 'a53be680', 'parent': false, 'order': 0 }, '5bc6edf5': { 'name': 'Row', 'background': '', 'tag': '18a95a2e-c0d5-428b-ac11-b2eea788b221', 'type': 'container', 'id': '5bc6edf5', 'parent': false, 'order': 1 }, 'de05a60e': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<p>You don&rsquo;t have to create your elements from scratch. Use already available root elements as a basis to quickly create your own elements or learn on the go.</p>', 'id': 'de05a60e', 'parent': '06d32eb8', 'order': 0.5 }, '23f9b57d': { 'name': 'Column', 'background': '', 'size': 'auto', 'tag': '3254e27e-49f8-4af6-993f-9f8b49f019ea', 'type': 'container', 'id': '23f9b57d', 'parent': '5bc6edf5', 'order': 0.30000000000000004 }, '1325288b': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<h2><strong>ONLINE EDITOR AND UPLOAD OPTIONS</strong></h2>', 'id': '1325288b', 'parent': '23f9b57d', 'order': 0 }, '8b9720a3': { 'name': 'Single Image', 'image': { 'ids': [], 'urls': [] }, 'tag': 'fbcfda40-18ee-4ca6-b692-99d86431e715', 'id': '8b9720a3', 'parent': 'cc355805', 'order': 0 }, 'e8c8c797': { 'tag': 'f7047182-3fb5-40e7-af7e-901a1d5fc9a6', 'name': 'Text block', 'output': '<p>Use Visual Composer Online Editor to create elements within our environment and instantly see preview. Or simply upload your content elements via smart element uploader.</p>', 'id': 'e8c8c797', 'parent': '23f9b57d', 'order': 1 }, '8c0873c0': { 'name': 'Column', 'background': '', 'size': 'auto', 'tag': '3254e27e-49f8-4af6-993f-9f8b49f019ea', 'type': 'container', 'id': '8c0873c0', 'parent': 'a53be680', 'order': 1.2 }, 'e8df3956': { 'name': 'Column', 'background': '', 'size': 'auto', 'tag': '3254e27e-49f8-4af6-993f-9f8b49f019ea', 'type': 'container', 'id': 'e8df3956', 'parent': '5bc6edf5', 'order': 0.7000000000000001 }, '06d32eb8': { 'name': 'Column', 'background': '', 'size': 'auto', 'tag': '3254e27e-49f8-4af6-993f-9f8b49f019ea', 'type': 'container', 'id': '06d32eb8', 'parent': '5bc6edf5', 'order': 0 } }
    // localStorage.getItem()
  }
}

vcCake.addService('local-storage', service)
