import { combineReducers } from 'redux'

import notificationsReducer from './notifications/slice'

export default combineReducers({
  notifications: notificationsReducer
})
