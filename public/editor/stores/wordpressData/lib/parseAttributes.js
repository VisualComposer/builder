export const parseGeneralAttributes = (attrs) => {
  const data = {}
  if (attrs.css) {
    // design options
    let cssData = attrs.css.split(/\s*(\.[^{]+)\s*\{\s*([^}]+)\s*\}\s*/g)
    if (cssData && cssData[ 1 ]) {
      data.customClass = cssData[ 1 ].replace('.', '')
    }

    let spl = cssData[ 2 ].split(';')
    let css = {}
    spl.forEach((i) => {
      if (i.length) {
        let innerSplit = i.split(/:\s/)
        let key = innerSplit[ 0 ].trim()
        let val = innerSplit[ 1 ].replace('!important', '').trim()
        css[ key ] = val
      }
    })
    console.log('TODO: migrate DO', css)
  }
  return data
}
