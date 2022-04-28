import { combineReducers } from 'redux'

import notificationsReducer from './notifications/slice'
import controlsReducer from './controls/slice'
import editorPopupReducer from './editorPopup/slice'
import sharedAssetsReducer from './sharedAssets/slice'
import insightsReducer from './insights/slice'

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  controls: controlsReducer,
  editorPopup: editorPopupReducer,
  sharedAssets: sharedAssetsReducer,
  insights: insightsReducer,
})

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>

export default rootReducer
