import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class PostsGridDataSourcePost extends vcvAPI.elementComponent {
  render () {
    let { attsCategory, attsLimit, attsOffset, attsSticky } = this.props.atts
    let query = 'post_type=post&post_status=publish'
    if (attsLimit && attsLimit.length) {
      attsLimit = attsLimit > 0 ? (attsLimit > 1000 ? 1000 : attsLimit) : 1000
      query += `&posts_per_page=${attsLimit}`
    }
    if (attsOffset && attsOffset.length) {
      attsOffset = attsOffset > 0 ? attsOffset : 0
      query += `&offset=${attsOffset}`
    }
    if (attsCategory && attsCategory.length) {
      query += `&tax_query[0][taxonomy]=category&tax_query[0][field]=id&tax_query[0][terms]=${attsCategory}`
    }
    if (attsSticky) {
      query += `&sticky_posts=true`
    }

    return (
      <div>{query}</div>
    )
  }
}
