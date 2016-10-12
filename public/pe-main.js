import 'medium-editor/dist/css/medium-editor.css'
import './sources/less/states/comon.less'
import './editor/modules/content/layout/css/contentEditable.less'
import publicAPI from './resources/api/publicAPI'
require('expose?$!jquery')

window.vcv = publicAPI
