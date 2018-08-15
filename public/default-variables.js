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
vcCake.env('FT_FIX_ELEMENT_STRETCH_BUTTON', true)
vcCake.env('FT_PARAM_GROUP_IN_EDIT_FORM', true)
vcCake.env('FT_TEASER_DROPDOWN', true)
vcCake.env('FT_DISABLE_ITEM_PREVIEW', true)
vcCake.env('FT_ADD_STRETCHED_CONTENT_OPTION', true)
vcCake.env('FT_BLANK_PAGE_BOXED', true)
vcCake.env('FT_INITIAL_CSS_LOAD', true)
