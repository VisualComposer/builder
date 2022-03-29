import { combineReducers } from 'redux'

import notificationsReducer from './notifications/slice'
import controlsReducer from './controls/slice'
import editorPopupReducer from './editorPopup/slice'

export default combineReducers({
  notifications: notificationsReducer,
  controls: controlsReducer,
  editorPopup: editorPopupReducer
})
