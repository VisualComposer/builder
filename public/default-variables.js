/**
 * IF YOU ADD NEW FEATURE TOGGLE REMOVE ONE OLD FEATURE TOGGLE
 */
import { env } from 'vc-cake'

env('debug', false) // Set false on real production deploy
env('TF_HEARTBEAT_HAS_CLASS_ERROR', false)
env('CSS_GRID', false)
// DO NOT MODIFY THIS!!!
env('THEME_LAYOUTS', false) // SEE the devAddons/themeEditor/themeEditor/src/*.js files
env('THEME_EDITOR', false)
// END OF DO NOT MODIFY
env('SAVE_ZIP', true)
env('TF_PARAM_GROUP_CSS_MIXINS', false)
env('FT_FIX_ELEMENT_STRETCH_BUTTON', true)
env('FT_PARAM_GROUP_IN_EDIT_FORM', true)
env('FT_TEASER_DROPDOWN', true)
env('FT_DISABLE_ITEM_PREVIEW', true)
env('FT_ADD_STRETCHED_CONTENT_OPTION', true)
env('FT_BLANK_PAGE_BOXED', true)
env('FT_INITIAL_CSS_LOAD', true)
env('FT_THIRD_PARTY_TAGS', true)
env('FT_EDIT_FORM_PERFORMANCE_OPTIMIZATION', false)
env('FT_MIGRATION_NOTICE', false)
env('FT_TEMPLATE_DATA_ASYNC', true)
env('FT_FIX_SINGLE_IMAGE_URL_DEPENDENCY', true)
env('FT_NESTED_ELEMENT_EDIT_FORM', false)
env('FT_ROW_COLUMN_LOGIC_REFACTOR', false)
env('FT_EDITOR_HUB_REDESIGN', false)
