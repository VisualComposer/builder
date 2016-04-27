import {getService} from 'vc-cake';
getService('element-manager').add(
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