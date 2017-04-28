import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class FacebookLike extends vcvAPI.elementComponent {
  timerIndex = 0

  constructor (props) {
    super(props)
    this.state = {
      status: ''
    }
  }

  componentDidMount () {
    this.insertHtml(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    let { layout, size } = this.props.atts

    if (layout !== nextProps.atts.layout || size !== nextProps.atts.size) {
      this.insertHtml(nextProps.atts)
    }
  }

  componentWillUnmount () {
    window.clearTimeout(this.checkVisibilityTimer)
    window.clearTimeout(this.checkIfRenderedTimer)
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

    likeBtn.style.position = 'absolute'
    likeBtn.style.opacity = '0'

    this.checkIfRendered(helperSelector, likeBtn, true)
  }

  checkIfRendered (helperSelector, likeBtn, firstTime) {
    let state = likeBtn.getAttribute('fb-xfbml-state')
    let likeBtnSpan = likeBtn.querySelector('span')

    if (state !== 'rendered') {
      let timeout = firstTime ? 500 : 50

      if (this.state.status !== 'loading') {
        helperSelector.innerHTML = '<span class="vcv-ui-icon vcv-ui-wp-spinner"></span>'
        this.setState({ status: 'loading' })
      }

      this.checkIfRenderedTimer = setTimeout(() => {
        this.checkIfRendered(helperSelector, likeBtn, false)
      }, timeout)
    } else {
      setTimeout(() => {
        this.setState({ status: 'rendered' })
        helperSelector.innerHTML = ''

        let visible = this.checkIfVisible(likeBtnSpan)

        if (!visible) {
          let imgSrc = this.getPublicImage('facebook-like-placeholder.png')
          helperSelector.innerHTML = `<img src="${imgSrc}" />`

          this.timerIndex = 0
          this.checkVisibilityTimer = setTimeout(() => {
            this.removePlaceholder(likeBtn, helperSelector)
          }, 500)

        } else {
          likeBtn.style.position = null
          likeBtn.style.opacity = null
          helperSelector.innerHTML = ''
        }
      }, 500)
    }
  }

  removePlaceholder (likeBtn, helperSelector) {
    this.timerIndex++

    if (this.timerIndex > 4) {
      return
    }

    if (this.checkIfVisible(likeBtn.querySelector('span'))) {
      likeBtn.style.position = null
      likeBtn.style.opacity = null
      helperSelector.innerHTML = ''
    } else {
      setTimeout(() => {
        this.removePlaceholder(likeBtn, helperSelector)
      }, 500)
    }
  }

  checkIfVisible (element) {
    return !(element.offsetHeight === 0 || element.offsetWidth === 0)
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

    let assetsManager = vcCake.getService('assetsManager')

    return assetsManager.getPublicPath(tag, filename)
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, alignment, metaCustomId } = atts
    let classes = 'vce-facebook-like'
    let innerClasses = 'vce-facebook-like-inner vce'
    let customProps = {}

    if (customClass) {
      classes += ` ${customClass}`
    }

    if (alignment) {
      classes += ` vce-facebook-like--align-${alignment}`
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return <div {...customProps} className={classes} {...editor}>
      <div className={innerClasses} ref='facebookLikeInner' id={'el-' + id} {...doAll}>Facebook Like</div>
    </div>
  }
}
