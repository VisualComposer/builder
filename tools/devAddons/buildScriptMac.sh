#!/bin/bash

 find devAddons/ -maxdepth 1 -type d | tail -n +2 | xargs -I % sh -c 'cd % && npm run build && sed -i "" "s:../../node_modules/:./node_modules/:g" public/dist/themeEditor.bundle.js && sed -i "" "s:../../node_modules/:./node_modules/:g" public/dist/layoutsView.bundle.js'
