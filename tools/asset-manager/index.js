'use strict'

let path = require('path')
let fs = require('fs')
var concat = require('concatenate-files')

let args = []
let namedArgs = {}
// get named args
process.argv.slice(2).forEach(function (value) {
  if (value.indexOf('--') === 0) {
    let namedData = value.split('=')
    namedArgs[ namedData[ 0 ] ] = namedData[ 1 ]
  } else {
    args.push(value)
  }
})

let elementsPath = args[ 0 ]
let elementsDir = false
if (!elementsPath || !(elementsDir = path.resolve(process.cwd(), elementsPath))) {
  console.error('Wrong element path')
  process.exit(1)
}

fs.lstat(elementsDir, function (err, stats) {
  if (!err && stats.isDirectory()) {
    getElements(elementsDir, (err, elements) => {
      if (err) {
        throw err
      }

      getCssFiles(elements, (files) => {
        if (namedArgs.hasOwnProperty('--output')) {
          let outputFile = path.resolve(process.cwd(), namedArgs[ '--output' ])
          concat(files, outputFile)
        }
      })
    })
  } else {
    console.error('Directory "${elementsDir}" does not exist!')
    process.exit(1)
  }
})

/**
 * Get path for each element
 * @param dir
 * @param done
 */
function getElements (dir, done) {
  let elements = []
  fs.readdir(dir, (err, dirList) => {
    if (err) {
      return done(err)
    }

    let pending = dirList.length
    // executes if empty dir
    if (!pending) {
      return done(null, elements)
    }

    // check all files
    dirList.forEach((file) => {
      file = path.resolve(dir, file)
      fs.stat(file, (err, stats) => {
        if (stats && stats.isDirectory()) {
          // check if it is element dir
          let elementFile = path.resolve(file, 'element.js')
          fs.stat(elementFile, (err, stats) => {
            if (err) {
              --pending
              return
            }
            if (stats && stats.isFile()) {
              elements.push(file)
              if (!--pending) {
                done(null, elements)
              }
            } else {
              if (!--pending) {
                done(null, elements)
              }
            }
          })
        } else {
          if (!--pending) {
            done(null, elements)
          }
        }
      })
    })
  })
}

/**
 * Get css files
 * @param elements
 * @param done
 * @returns {*}
 */
function getCssFiles (elements, done) {
  let cssFiles = []

  let pending = elements.length
  // executes if empty dir
  if (!pending) {
    return done(cssFiles)
  }

  elements.forEach((element) => {
    let cssFile = path.resolve(element, 'styles.css')
    fs.stat(cssFile, (err, stats) => {
      if (err) {
        if (!--pending) {
          done(cssFiles)
        }
      } else {
        if (stats && stats.isFile()) {
          cssFiles.push(cssFile)
          if (!--pending) {
            done(cssFiles)
          }
        } else {
          if (!--pending) {
            done(cssFiles)
          }
        }
      }
    })
  })
}
