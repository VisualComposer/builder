import { combineReducers } from 'redux'

import notificationsReducer from './notifications/slice'
import controlsReducer from './controls/slice'

export default combineReducers({
  notifications: notificationsReducer,
  controls: controlsReducer
})
