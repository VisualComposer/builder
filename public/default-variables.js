import vcCake from 'vc-cake'

vcCake.env('FEATURE_WEBPACK', false)
vcCake.env('debug', false) // Set false on real production deploy
vcCake.env('FIX_DND_FOR_TABS', true)
vcCake.env('CONTAINER_DIVIDER', true)
vcCake.env('MOBILE_DETECT', false)
vcCake.env('HUB_TEASER', false)
vcCake.env('FEATURE_ASSETS_FILTER', false)
