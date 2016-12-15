/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
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
  }

  createHtml (atts) {
    let { layout, size } = atts
    let url = window.vcvPostPermanentLink

    let script = `<div id="fb-root"></div>
<script>(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>`

    let html = `<div class="fb-like" data-href="${url}" data-layout="${layout}" data-action="like" data-size="${size}" data-show-faces="false" data-share="false"></div>`

    let iframe = document.querySelector('#vcv-editor-iframe').contentWindow
    if (iframe.FB) {
      iframe.FB.init({ status: true, xfbml: true, version: 'v2.8' })
    }

    return script + html
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
