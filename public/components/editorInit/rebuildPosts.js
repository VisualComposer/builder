import vcCake from 'vc-cake'
import PostBuilder from '../../postBuilder'

export const rebuildPosts = () => {
  const builder = new PostBuilder()
  window.vcvRebuildPostSave = async (data) => {
    return builder.update(data)
  }

  window.vcvRebuildPostSkipPost = (id) => {
    vcCake.getStorage('wordpressData').trigger('skipPost', id)
  }
  window.vcv = vcCake.getService('api').publicEvents
}
