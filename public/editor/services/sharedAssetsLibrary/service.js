import vcCake from 'vc-cake'

const SharedAssets = window.VCV_GET_SHARED_ASSETS()

const API = {
  getAssetsLibraryFiles: (library) => {
    let data = SharedAssets[ library ]
    let files = {
      cssBundles: [],
      jsBundles: []
    }

    if (data) {
      if (data.dependencies && data.dependencies.length) {
        data.dependencies.forEach((dependency) => {
          let dependencyLibraryFiles = API.getAssetsLibraryFiles(dependency)
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
    }
    return files
  }
}
vcCake.addService('sharedAssetsLibrary', API)
