import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class PostsGridDataSourcePage extends vcvAPI.elementComponent {
  render () {
    let { attsLimit, attsOffset } = this.props.atts
    let query = 'post_type=page&post_status=publish'
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
