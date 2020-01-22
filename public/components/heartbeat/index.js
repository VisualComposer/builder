/**
 * Heartbeat refresh nonces.
 */
export default ($) => {
  let check, timeout
  /**
   * @see wp-admin/js/post.js:246
   * Only allow to check for nonce refresh every 30 seconds.
   */
  const schedule = () => {
    check = false
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => { check = true }, 30 * 1000)
  }

  $(document).on('heartbeat-send.wp-refresh-nonces', (e, data) => {
    if (!data) {
      return
    }
    const $authCheck = $('#wp-auth-check-wrap')

    if (check || ($authCheck.length && !$authCheck.hasClass('hidden'))) {
      data['wp-refresh-post-nonces'] = {
        post_id: window.vcvSourceID
      }
    }
  }).on('heartbeat-tick.wp-refresh-nonces', (e, data) => {
    if (!data) {
      return
    }
    const nonces = data['wp-refresh-post-nonces']

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
        const iframe = document.getElementById('vcv-editor-iframe')
        if (iframe && iframe.contentWindow) {
          const oldUrl = iframe.contentWindow.location.href
          const newUrl = oldUrl.replace(/(vcv-nonce=).*?(&|$)/, '$1' + nonces.vcvNonce + '$2')
          iframe.contentWindow.history.replaceState('vcvNonce', '', newUrl)
        }
      }
    }
  }).ready(schedule)
}
