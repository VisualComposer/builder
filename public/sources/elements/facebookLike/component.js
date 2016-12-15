/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  likeSizes = {
    standard: {
      small: {
        width: '450',
        height: '30'
      },
      large: {
        width: '450',
        height: '30'
      }
    },
    box_count: {
      small: {
        width: '56',
        height: '40'
      },
      large: {
        width: '69',
        height: '58'
      }
    },
    button_count: {
      small: {
        width: '105',
        height: '20'
      },
      large: {
        width: '126',
        height: '28'
      }
    },
    button: {
      small: {
        width: '56',
        height: '20'
      },
      large: {
        width: '69',
        height: '28'
      }
    }
  }

  componentDidMount () {
    this.insertHtml(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    let { url, layout, size } = this.props.atts

    if (layout !== nextProps.atts.layout || size !== nextProps.atts.size || url !== nextProps.atts.url) {
      this.insertHtml(nextProps.atts)
    }
  }

  insertHtml (atts) {
    let html = this.createHtml(atts)
    const wrapper = this.refs.facebookLikeInner
    this.updateInlineHtml(wrapper, html)
  }

  createHtml (atts) {
    let { url, layout, size } = atts
    // let url = window.vcvPostPermanentLink
    // let width = this.likeSizes[layout][size].width
    // let height = this.likeSizes[layout][size].height

//     let html = `<iframe src="https://www.facebook.com/plugins/like.php?
// href=${url}&amp;width=${width}&amp;layout=${layout}&amp;action=like&amp;size=${size}&amp;show_faces=false&amp;share=false&amp;height=${height}" width=${width} height=${height} scrolling="no" frameborder="0" allowTransparency="true"></iframe>`

    let script = `<div id="fb-root"></div>
<script>(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=1165810236784781";
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
