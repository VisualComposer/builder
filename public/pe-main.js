import 'medium-editor/dist/css/medium-editor.css'
import './sources/less/states/comon.less'
import publicAPI from './resources/api/publicAPI'

require('expose?$!jquery')

window.vcv = publicAPI
