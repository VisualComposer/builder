import { add } from 'vc-cake'

add('heartbeat', (api) => {
  /**
   * Heartbeat refresh nonces.
   */
  (function ($) {
    let check, timeout

    /**
     * @see wp-admin/js/post.js:246
     * Only allow to check for nonce refresh every 30 seconds.
     */
    let schedule = () => {
      check = false
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => { check = true }, 30 * 1000)
    }

    $(document).on('heartbeat-send.wp-refresh-nonces', (e, data) => {
      let $authCheck = $('#wp-auth-check-wrap')

      if (check || ($authCheck.length && !$authCheck.hasClass('hidden'))) {
        data[ 'wp-refresh-post-nonces' ] = {
          post_id: window.vcvSourceID
        }
      }
    }).on('heartbeat-tick.wp-refresh-nonces', (e, data) => {
      let nonces = data[ 'wp-refresh-post-nonces' ]

      if (nonces) {
        schedule()

        if (nonces.replace) {
          $.each(nonces.replace, function (selector, value) {
            $('#' + selector).val(value)
          })
        }

        if (nonces.heartbeatNonce && window.heartbeatSettings) {
          window.heartbeatSettings.nonce = nonces.heartbeatNonce
        }
        // Update Visual Composer nonce
        if (nonces.vcvNonce) {
          window.vcvNonce = nonces.vcvNonce
        }
      }
    }).ready(schedule)
  }(window.jQuery))
})
