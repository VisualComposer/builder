export const removeTags = (str) => {
  if ((str === null) || (str === '')) { return false } else { str = str.toString() }
  return str.replace(/(<([^>]+)>)/ig, '')
}

export const statusAvatarColor = {
  open: '#272D3C',
  'in-progress': '#ffa532',
  'pending-review': '#fcd227',
  complete: '#3ed696'
}

export const urgencyAvatarColor = {
  low: '#3ed696',
  medium: '#fcd227',
  high: '#ffa532',
  critical: '#ff5a48'
}

export const textColor = {
  open: '#fff',
  'in-progress': '#fff',
  'pending-review': '#272D3C',
  complete: '#272D3C'
}

export const videoIdGenerator = (url) => {
  const indexOfId = url.replace(/\s/g, '').search('v=')
  if (indexOfId > 0) {
    const id = url.slice(indexOfId + 2).split('&')[0]
    return id
  } else if (url.search('.be/') > 0) {
    const indexIdOfShortVideo = url.search('.be/')
    const id = url.slice(indexIdOfShortVideo + 4).split('&')[0]
    return id
  } else {
    return ''
  }
}
