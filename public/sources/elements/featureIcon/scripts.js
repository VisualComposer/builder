let classes = 'vce-features'
let customProps = {}
let CustomTag = 'i'


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

if (shape && shape !== 'square') {
  classes += ` vce-features--border-${shape}`
}
