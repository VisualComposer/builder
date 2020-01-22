import fonts from 'public/sources/attributes/googleFonts/lib/google-fonts-set.json'

const googleFonts = fonts.families

const getFontVariant = function (fontStyle, fontWeight, position) {
  const availableVariants = googleFonts[position].variants
  if (availableVariants && availableVariants.length === 1 && availableVariants[0] === 'regular') {
    return 'all'
  }
  let variant = ''
  if (fontStyle === 'normal' && fontWeight === '400') {
    variant = 'regular'
  } else if (fontStyle === 'italic' && fontWeight === '400') {
    variant = 'italic'
  } else if (fontStyle === 'italic') {
    variant = `${fontWeight}${fontStyle}`
  } else {
    variant = fontWeight
  }
  const isAvailable = availableVariants.indexOf(variant) > -1
  if (isAvailable) {
    return variant
  } else {
    return 'all'
  }
}

const getUsedFonts = function (element) {
  const allFonts = {}
  for (const node of element.querySelectorAll('*')) {
    const computedStyles = window.getComputedStyle(node)
    let fontFamily = computedStyles.fontFamily

    // Remove the surrounding quotes around elements
    fontFamily = fontFamily.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim()

    const familyPositionInFonts = googleFonts.map((item) => { return item.family.toLowerCase() }).indexOf(fontFamily.toLowerCase())

    if (familyPositionInFonts > -1) {
      const fontStyle = computedStyles.fontStyle
      const fontWeight = computedStyles.fontWeight
      const fontVariant = getFontVariant(fontStyle, fontWeight, familyPositionInFonts)

      if (allFonts.hasOwnProperty(fontFamily)) {
        if (allFonts[fontFamily].variants.indexOf('all') < 0 && allFonts[fontFamily].variants.indexOf(fontVariant) < 0) {
          allFonts[fontFamily].variants.push(fontVariant)
        }
      } else {
        allFonts[fontFamily] = {
          variants: [fontVariant],
          subsets: googleFonts[familyPositionInFonts].subsets
        }
      }
    }
  }

  Object.keys(allFonts).forEach((key) => {
    if (allFonts[key].variants.indexOf('all') > -1) {
      delete allFonts[key].variants
    }
  })

  return allFonts
}

export default getUsedFonts
