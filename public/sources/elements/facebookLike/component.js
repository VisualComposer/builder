/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  status

  componentDidMount () {
    this.insertHtml(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    let { layout, size } = this.props.atts

    if (layout !== nextProps.atts.layout || size !== nextProps.atts.size) {
      this.insertHtml(nextProps.atts)
    }
  }

  insertHtml (atts) {
    let html = this.createHtml(atts)
    const wrapper = this.refs.facebookLikeInner
    this.updateInlineHtml(wrapper, html)
    this.reloadScript()
    this.setPlaceholder()
  }

  setPlaceholder () {
    let likeBtn = this.getDomNode().querySelector('.fb-like')
    let state = likeBtn.getAttribute('fb-xfbml-state')
    const helper = document.createElement('vcvhelper')
    helper.className = 'vce-facebook-like-placeholder'
    this.refs.facebookLikeInner.appendChild(helper)
    let helperSelector = this.getDomNode().querySelector('.vce-facebook-like-placeholder')

    likeBtn.style.float = 'left'

    this.checkIfRendered(helperSelector, likeBtn)
  }

  checkIfRendered (helperSelector, likeBtn) {
    let state = likeBtn.getAttribute('fb-xfbml-state')

    if (state !== 'rendered') {
      if (this.status !== 'loading') {
        helperSelector.innerHTML = '<span class="vcv-ui-icon vcv-ui-wp-spinner"></span>'
      }
      this.status = 'loading'

      setTimeout(() => {
        this.checkIfRendered(helperSelector, likeBtn)
      }, 50)
    } else {
      this.status = 'rendered'
      helperSelector.innerHTML = ''

      if (likeBtn.offsetHeight === 0 || likeBtn.offsetWidth === 0) {
        let imgSrc = this.getPublicImage('facebook-like-placeholder.png')
        helperSelector.innerHTML = `<img src="${imgSrc}" />`
      } else {
        likeBtn.style.float = null
        helperSelector.innerHTML = ''
      }
    }
  }

  reloadScript () {
    let iframe = document.querySelector('#vcv-editor-iframe').contentWindow
    if (iframe.FB) {
      iframe.FB.init({ status: true, xfbml: true, version: 'v2.8' })
    }
  }

  createHtml (atts) {
    let { layout, size } = atts
    let url = window.vcvPostPermanentLink

    let script = `<script>(function(d, s, id) {
  if(d.getElementById('fb-root')) return;
  var fbRoot = d.createElement('div');
  fbRoot.id = 'fb-root';
  document.getElementsByTagName('body')[0].appendChild(fbRoot);
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>`

    let html = `<div class="fb-like" data-href="${url}" data-layout="${layout}" data-action="like" data-size="${size}" data-show-faces="false" data-share="false"></div>`

    return script + html
  }

  getPublicImage (filename) {
    let { tag } = this.props.atts

    let assetsManager
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      assetsManager = vcCake.getService('wipAssetsManager')
    } else {
      assetsManager = vcCake.getService('assets-manager')
    }

    return assetsManager.getPublicPath(tag, filename)
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment } = atts
    let classes = 'vce-facebook-like'
    let innerClasses = 'vce-facebook-like-inner vce'
    let customProps = {}

    if (customClass) {
      classes += ` ${customClass}`
    }

    if (alignment) {
      classes += ` vce-facebook-like--align-${alignment}`
    }

    let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
    let animations = []
    devices.forEach((device) => {
      let prefix = designOptions.visibleDevices[ device ]
      if (designOptions[ device ].animation) {
        if (prefix) {
          prefix = `-${prefix}`
        }
        animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
      }
    })
    if (animations.length) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }

    return <div {...customProps} className={classes} {...editor}>
      <div className={innerClasses} ref='facebookLikeInner' id={'el-' + id}>Facebook Like</div>
    </div>
  }
}
