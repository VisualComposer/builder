import vcCake from 'vc-cake'
import store from 'public/editor/stores/store'

interface Library {
  dependencies: string[]
  name: string
  subset?: string
}

const API = {
  getAssetsLibraryFiles: (library:Library|string) => {
    const sharedAssets = store.getState().sharedAssets.sharedAssets
    const data = typeof library === 'string' ? sharedAssets[library] : sharedAssets[library.name]
    const files = {
      cssBundles: [],
      jsBundles: []
    }

    if (data) {
      if (typeof library !== 'string' && library.dependencies && library.dependencies.length) {
        library.dependencies.forEach((dependency:string) => {
          const dependencyLibraryFiles = API.getAssetsLibraryFiles(dependency)
          if (dependencyLibraryFiles.cssBundles && dependencyLibraryFiles.cssBundles.length) {
            files.cssBundles = files.cssBundles.concat(dependencyLibraryFiles.cssBundles)
          }
          if (dependencyLibraryFiles.jsBundles && dependencyLibraryFiles.jsBundles.length) {
            files.jsBundles = files.jsBundles.concat(dependencyLibraryFiles.jsBundles)
          }
        })
      }

      if (data.cssBundle) {
        files.cssBundles = files.cssBundles.concat(data.cssBundle)
      }

      if (data.jsBundle) {
        files.jsBundles = files.jsBundles.concat(data.jsBundle)
      }

      if (typeof library !== 'string' && library.subset && data.cssSubsetBundles) {
        const subsetBundle = data.cssSubsetBundles[library.subset]
        if (subsetBundle) {
          files.cssBundles = files.cssBundles.concat(subsetBundle)
        }
      }
    }
    // Remove duplicates
    files.cssBundles = [...new Set(files.cssBundles)]
    files.jsBundles = [...new Set(files.jsBundles)]
    return files
  },
  /**
   * Get source path
   * @param file
   * @returns {*}
   */
  getSourcePath: (file:string|null = null) => {
    const dataManager = vcCake.getService('dataManager')
    let path = dataManager.get('pluginSourceUrl')
    if (file && file.match('^(https?:)?\\/\\/?')) {
      return file
    }
    if (file) {
      path += file.replace(/^\//, '')
    }

    return path
  }
}
vcCake.addService('sharedAssetsLibrary', API)
