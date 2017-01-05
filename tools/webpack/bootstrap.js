module.exports = {
  vc: {
    node: {
      modules: [
        'content/storage',
        'content/assets',
        'content/layout',
        'content/tree-view-dnd',
        'content/local-storage/data-load',
        'content/local-storage/data-save',
        'content/local-storage/data-unload',
        'ui/layout-bar',
        'ui/navbar',
        'ui/brand-logo',
        'ui/addElement',
        'ui/edit-element',
        'ui/addTemplate',
        'ui/tree-view',
        'ui/undo-redo',
        'ui/layout-control',
        'ui/settings',
        'ui/navbar-separator',
        'ui/node-save'
      ],
      services: [
        'utils',
        'assets-manager',
        'document',
        'local-storage',
        'cook',
        'shared-library',
        'assets-library',
        'time-machine',
        'actions-manager',
        'rules-manager',
        'api',
        'categories',
        'dataProcessor',
        'wipAssetsStorage',
        'wipAssetsManager',
        'wipStylesManager',
        'myTemplates'
      ]
    },
    wp: {
      modules: [
        'content/storage',
        'content/assets',
        'content/layout',
        'content/wordpress/data-load',
        'content/wordpress/data-save',
        'content/wordpress/data-unload',
        'content/tree-view-dnd',
        'ui/layout-bar',
        'ui/navbar',
        'ui/brand-logo',
        'ui/addElement',
        'ui/edit-element',
        'ui/addTemplate',
        'ui/tree-view',
        'ui/undo-redo',
        'ui/layout-control',
        'ui/settings',
        'ui/navbar-separator',
        'ui/wordpress-post'
      ],
      services: [
        'utils',
        'assets-manager',
        'document',
        'wordpress-post-data',
        'cook',
        'shared-library',
        'assets-library',
        'time-machine',
        'actions-manager',
        'rules-manager',
        'api',
        'categories',
        'dataProcessor',
        'wipAssetsStorage',
        'wipAssetsManager',
        'wipStylesManager',
        'myTemplates'
      ]
    }
  }
}
