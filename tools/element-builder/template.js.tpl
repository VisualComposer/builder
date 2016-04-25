vcCake.getService('element-manager').addElement(
  {{ settings() }},
  // Component callback
  function() {
    {{ Component() }}
  },
  // css settings // css for element
  {{ cssSettings() }},
  // javascript callback
  {{ jsCallback() }},
  // editor js
 {{ editorJsSettings() }}
);