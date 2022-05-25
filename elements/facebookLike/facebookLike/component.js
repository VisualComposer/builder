import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class FacebookLike extends vcvAPI.elementComponent {
  timerIndex = 0

  constructor (props) {
    super(props)
    this.facebookLikeInner = React.createRef()
    this.state = {
      status: ''
    }
  }

  componentDidMount () {
    this.insertHtml(this.props.atts)
  }

  componentDidUpdate (prevProps) {
    const { layout, size } = this.props.atts

    if (prevProps.atts.layout !== layout || prevProps.atts.size !== size) {
      this.insertHtml(this.props.atts)
    }
  }

  componentWillUnmount () {
    window.clearTimeout(this.checkVisibilityTimer)
    window.clearTimeout(this.checkIfRenderedTimer)
  }

  insertHtml (atts) {
    const html = this.createHtml(atts)
    const wrapper = this.facebookLikeInner.current
    this.updateInlineHtml(wrapper, html)
    this.reloadScript()
    this.setPlaceholder()
  }

  setPlaceholder () {
    const likeBtn = this.getDomNode().querySelector('.fb-like')
    if (!likeBtn) {
      return
    }
    const helper = document.createElement('div')
    helper.className = 'vcvhelper vce-facebook-like-placeholder'
    this.facebookLikeInner.current.appendChild(helper)
    const helperSelector = this.getDomNode().querySelector('.vce-facebook-like-placeholder')

    likeBtn.style.position = 'absolute'
    likeBtn.style.opacity = '0'

    this.checkIfRendered(helperSelector, likeBtn, true)
  }

  checkIfRendered (helperSelector, likeBtn, firstTime) {
    const state = likeBtn.getAttribute('fb-xfbml-state')
    const likeBtnSpan = likeBtn.querySelector('span')

    if (state !== 'rendered') {
      const timeout = firstTime ? 500 : 50

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

        const visible = this.checkIfVisible(likeBtnSpan)

        if (!visible) {
          const imgSrc = this.getPublicImage('facebook-like-placeholder.png')
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
    return !(element === null || element.offsetHeight === 0 || element.offsetWidth === 0)
  }

  reloadScript () {
    const iframe = document.querySelector('#vcv-editor-iframe').contentWindow
    if (iframe.FB) {
      iframe.FB.init({ status: true, xfbml: true, version: 'v2.12' })
    }
  }

  createHtml (atts) {
    const { layout, size } = atts
    const url = window.vcvPostPermanentLink

    const script = `<script>(function(d, s, id) {
  if(d.getElementById('fb-root')) return;
  var fbRoot = d.createElement('div');
  fbRoot.id = 'fb-root';
  document.getElementsByTagName('body')[0].appendChild(fbRoot);
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>`

    const html = `<div class="fb-like" data-href="${url}" data-layout="${layout}" data-action="like" data-size="${size}" data-show-faces="false" data-share="false"></div>`

    return script + html
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, alignment, metaCustomId } = atts
    let classes = 'vce-facebook-like'
    const innerClasses = 'vce-facebook-like-inner vce'
    const customProps = {}

    if (customClass) {
      classes += ` ${customClass}`
    }

    if (alignment) {
      classes += ` vce-facebook-like--align-${alignment}`
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div {...customProps} className={classes} {...editor}>
        <div className={innerClasses} ref={this.facebookLikeInner} id={'el-' + id} {...doAll}>Facebook Like</div>
      </div>
    )
  }
}
