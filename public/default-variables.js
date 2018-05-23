import vcCake from 'vc-cake'

vcCake.env('debug', false) // Set false on real production deploy
vcCake.env('FIX_DND_FOR_TABS', true)
vcCake.env('REFACTOR_ELEMENT_ACCESS_POINT', true)
vcCake.env('TF_HEARTBEAT_HAS_CLASS_ERROR', false)
vcCake.env('CSS_GRID', false)
// DO NOT MODIFY THIS!!!
vcCake.env('THEME_LAYOUTS', false) // SEE the devAddons/themeEditor/themeEditor/src/*.js files
vcCake.env('THEME_EDITOR', false)
// END OF DO NOT MODIFY
vcCake.env('TF_FIX_EMPTY_ELEMENT_SECTION', true)
vcCake.env('TF_TEMPLATES_DROPDOWN_UPDATE', true)
vcCake.env('TF_SETTINGS_THEME_ICONS', true)
vcCake.env('TF_RENDER_PERFORMANCE', true)
vcCake.env('CACHE_HOVER_CONTROLS', true)
vcCake.env('TF_FREE_VERSION_DOWNLOAD', true)
vcCake.env('SINGLE_IMAGE_REFACTOR', true)
vcCake.env('TF_ELEMENT_CRUD_PERFORMANCE', false)
vcCake.env('TF_PARAM_GROUP_CSS_MIXINS', false)
vcCake.env('TEMPLATE_PANEL_PERF', true)
vcCake.env('VCV_HUB_ADDON_TEASER', true)
vcCake.env('FIX_SHORTCODE_BLOCKS_TEXT_BLOCK_EDIT', true)
vcCake.env('FT_WAIT_FOR_FINAL_RENDER', true)
vcCake.env('FT_CSS_CACHE', true)
vcCake.env('FE_SHORTCODES_SCRIPTS', true) // USED in Elements.
vcCake.env('FT_TEMPLATE_LOAD_ASYNC', true)
vcCake.env('FT_SHOW_ALL_LAYOUTS', true)
vcCake.env('FT_COLLAPSE_ELEMENTS_TREE_VIEW', true)
vcCake.env('FT_ADD_ELEMENT_LIST', false)
