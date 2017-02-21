/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    let { attsPostType, attsLimit, attsOffset } = this.props.atts
    let query = `post_type=${attsPostType}&post_status=publish,inherit`
    if (attsLimit && attsLimit.length) {
      attsLimit = attsLimit > 0 ? (attsLimit > 1000 ? 1000 : attsLimit) : 1000
      query += `&posts_per_page=${attsLimit}`
    }
    if (attsOffset && attsOffset.length) {
      attsOffset = attsOffset > 0 ? attsOffset : 0
      query += `&offset=${attsOffset}`
    }

    return (
      <div>{query}</div>
    )
  }
}
