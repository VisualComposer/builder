require('medium-editor/dist/css/medium-editor.css')
require('./sources/less/states/comon.less')
import publicAPI from './resources/api/publicAPI'
require('expose?$!jquery')

window.vcv = publicAPI
