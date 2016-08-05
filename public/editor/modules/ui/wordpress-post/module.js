import vcCake from 'vc-cake'
import WordPressPostSaveControl from './lib/navbar-save-control'
import WordPressAdminControls from './lib/navbar-post-controls'

import '../../../../sources/less/ui/loader/init.less'

vcCake.add('ui-wordpress-post', (api) => {
  api.module('ui-navbar').do('addElement', 'Post Save Control', WordPressPostSaveControl,
    {
      pin: 'visible',
      api: api
    }
  )
  api.module('ui-navbar').do('addElement', 'Wordpress Admin Controls', WordPressAdminControls,
    {
      pin: 'hidden',
      api: api
    }
  )
})
