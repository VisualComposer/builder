/**
 * IF YOU ADD NEW FEATURE TOGGLE REMOVE ONE OLD FEATURE TOGGLE
 */
import vcCake from 'vc-cake'

vcCake.env('debug', false) // Set false on real production deploy
vcCake.env('TF_HEARTBEAT_HAS_CLASS_ERROR', false)
vcCake.env('CSS_GRID', false)
// DO NOT MODIFY THIS!!!
vcCake.env('THEME_LAYOUTS', false) // SEE the devAddons/themeEditor/themeEditor/src/*.js files
vcCake.env('THEME_EDITOR', false)
// END OF DO NOT MODIFY
vcCake.env('SAVE_ZIP', true)
vcCake.env('TF_PARAM_GROUP_CSS_MIXINS', false)
vcCake.env('FT_FIX_SHOW_ELEMENT_CONTROL', true)
vcCake.env('FT_SHARED_ASSET_LIBS', true)
