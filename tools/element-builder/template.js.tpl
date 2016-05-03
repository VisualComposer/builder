import {getService} from 'vc-cake';
getService('cook').add(
  {{ settings() }},
  // Component callback
  {{ Component() }},
  // css settings // css for element
  {{ cssSettings() }},
  // javascript callback
  {{ jsCallback() }},
  // editor js
 {{ editorJsSettings() }}
);