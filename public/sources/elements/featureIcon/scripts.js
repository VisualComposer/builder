let classes = 'vce-features'
let customProps = {}
let CustomTag = 'i'
let tinycolor = require('react-color/modules/tinycolor2')
let colorValue = tinycolor(iconColor).toRgbString()

if (addUrl) {
  CustomTag = 'a'
  let { url, title, targetBlank, relNofollow } = buttonUrl
  customProps = {
    'href': url,
    'title': title,
    'target': targetBlank ? '_blank' : undefined,
    'rel': relNofollow ? 'nofollow' : undefined
  }
}

if (shape) {
  classes += ` vce-features--style-${shape}`
}
