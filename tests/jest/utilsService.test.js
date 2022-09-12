/* global describe, test, expect */
import vcCake from 'vc-cake'
import '../../public/variables'

// Services & Storages
import '../../public/editor/services/dataManager/service'
import '../../public/editor/services/roleManager/service'
import '../../public/editor/services/utils/service'
import '../../public/editor/services/document/service'
import '../../public/editor/services/cook/service'
import '../../public/editor/services/modernAssetsStorage/service'
import '../../public/editor/services/api/service'
import '../../public/config/wp-attributes'
import '../../public/editor/stores/elements/elementsStorage'
import '../../public/editor/stores/elements/elementSettings'

// Elements
import '../../elements/row/row/index'
import '../../elements/column/column/index'
import '../../elements/textBlock/textBlock/index'

jest.useFakeTimers()

describe('Test utilsService', () => {
  const utils = vcCake.getService('utils')

  vcCake.env('VCV_DEBUG', true)
  vcCake.start(() => {
    test('Utils Service blockRegexp dynamic fields', () => {
      const vcBlocksRegexp = utils.getBlockRegexp()
      const wpBlocksRegexp = utils.getBlockRegexp(false)

      // Falsy
      expect(''.match(vcBlocksRegexp)).toBe(null)
      expect('<!-- wp:latest-comments /-->'.match(vcBlocksRegexp)).toStrictEqual(null)
      expect('<!-- wp:core-embed/spotify {"url":"http://example.com"} -->'.match(vcBlocksRegexp)).toStrictEqual(null)
      expect(`<!-- wp:core-embed/spotify {"url":"http://example.com"} -->
<figure class="wp-block-embed-spotify wp-block-embed"><div class="wp-block-embed__wrapper">
http://example.com
</div></figure>
<!-- /wp:core-embed/spotify -->`.match(vcBlocksRegexp)).toStrictEqual(null)

      // templateBlock is not and dynamic fields so it must not pass
      expect('<!-- wp:vcv-gutenberg-blocks/template-block {"vcwbTemplate":"907"} /-->'.match(vcBlocksRegexp)).toBe(null)

      // dynamic fields
      expect('<!-- wp:vcv-gutenberg-blocks/dynamic-field-block --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->'.match(vcBlocksRegexp)).toStrictEqual([
        "<!-- wp:vcv-gutenberg-blocks/dynamic-field-block -->",
        "<!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->",
      ])

      // Truths
      expect('<!-- wp:latest-comments /-->'.match(wpBlocksRegexp)).toStrictEqual(["<!-- wp:latest-comments /-->"])
      expect('<!-- wp:core-embed/spotify {"url":"http://example.com"} -->'.match(wpBlocksRegexp)).toStrictEqual(["<!-- wp:core-embed/spotify {\"url\":\"http://example.com\"} -->"])
      expect(`<!-- wp:core-embed/spotify {"url":"http://example.com"} -->
<figure class="wp-block-embed-spotify wp-block-embed"><div class="wp-block-embed__wrapper">
http://example.com
</div></figure>
<!-- /wp:core-embed/spotify -->`.match(wpBlocksRegexp)).toStrictEqual(["<!-- wp:core-embed/spotify {\"url\":\"http://example.com\"} -->", "<!-- /wp:core-embed/spotify -->"])
      expect('<!-- wp:vcv-gutenberg-blocks/template-block {"vcwbTemplate":"907"} /-->'.match(wpBlocksRegexp)).toStrictEqual(["<!-- wp:vcv-gutenberg-blocks/template-block {\"vcwbTemplate\":\"907\"} /-->"])

      // dynamic fields also should match wpBlocks
      expect('<!-- wp:vcv-gutenberg-blocks/dynamic-field-block --><!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->'.match(wpBlocksRegexp)).toStrictEqual([
        "<!-- wp:vcv-gutenberg-blocks/dynamic-field-block -->",
        "<!-- /wp:vcv-gutenberg-blocks/dynamic-field-block -->",
      ])
    })
  })
})
