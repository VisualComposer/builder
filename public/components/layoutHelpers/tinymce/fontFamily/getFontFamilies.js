import fonts from 'public/sources/attributes/googleFonts/lib/google-fonts-set.json'

const googleFonts = fonts.families

const getFontFamilies = function () {
  const defaultItem = { family: 'Default Font', value: '', defaultFont: true }
  const defaultFontsFormats = [
    { family: 'Andale Mono', value: 'andale mono,monospace', defaultFont: true },
    { family: 'Arial', value: 'arial,helvetica,sans-serif', defaultFont: true },
    { family: 'Arial Black', value: 'arial black,sans-serif', defaultFont: true },
    { family: 'Book Antiqua', value: 'book antiqua,palatino,serif', defaultFont: true },
    { family: 'Comic Sans MS', value: 'comic sans ms,sans-serif', defaultFont: true },
    { family: 'Courier New', value: 'courier new,courier,monospace', defaultFont: true },
    { family: 'Georgia', value: 'georgia,palatino,serif', defaultFont: true },
    { family: 'Helvetica', value: 'helvetica,arial,sans-serif', defaultFont: true },
    { family: 'Impact', value: 'impact,sans-serif', defaultFont: true },
    { family: 'Symbol', value: 'symbol', defaultFont: true },
    { family: 'Tahoma', value: 'tahoma,arial,helvetica,sans-serif', defaultFont: true },
    { family: 'Terminal', value: 'terminal,monaco,monospace', defaultFont: true },
    { family: 'Times New Roman', value: 'times new roman,times,serif', defaultFont: true },
    { family: 'Trebuchet MS', value: 'trebuchet ms,geneva,sans-serif', defaultFont: true },
    { family: 'Verdana', value: 'verdana,geneva,sans-serif', defaultFont: true },
    { family: 'Webdings', value: 'webdings', defaultFont: true },
    { family: 'Wingdings', value: 'wingdings,zapf dingbats', defaultFont: true }
  ]

  return [defaultItem, ...defaultFontsFormats, ...googleFonts]
}

export default getFontFamilies
