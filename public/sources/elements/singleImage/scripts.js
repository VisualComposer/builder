var imgSrc = image;
if (typeof imgSrc !== 'string' && typeof imgSrc.urls[ 0 ] !== 'undefined') {
  imgSrc = imgSrc.urls[0].full;
}