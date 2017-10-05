import vcCake from 'vc-cake'

vcCake.env('FEATURE_WEBPACK', false)
vcCake.env('debug', false) // Set false on real production deploy
vcCake.env('FIX_DND_FOR_TABS', true)
vcCake.env('CONTAINER_DIVIDER', true)
vcCake.env('MOBILE_DETECT', true)
vcCake.env('HUB_TEASER', true)
vcCake.env('FEATURE_ASSETS_FILTER', false)
vcCake.env('CONTAINER_DIVIDER_EMBED_VIDEO', false)
vcCake.env('DND_SMART_LINE_TRANSITION', true)
vcCake.env('DND_TRASH_BIN', true)
vcCake.env('DND_DISABLE_DROP_IN_CLOSED_TABS', false)
vcCake.env('ELEMENT_CONTROLS_DELAY', true)
