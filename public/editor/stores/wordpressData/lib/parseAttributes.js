export const parseGeneralAttributes = (attrs) => {
  const data = {}
  if (attrs.css) {
    // design options
    let cssData = attrs.css.split(/\s*(\.[^{]+)\s*\{\s*([^}]+)\s*\}\s*/g)
    if (cssData && cssData[ 1 ]) {
      data.customClass = cssData[ 1 ].replace('.', '')
    }
  }
  return data
}
