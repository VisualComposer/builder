#!/bin/bash

 find devElements/ -maxdepth 1 -type d | tail -n +2 | xargs -I % sh -c 'cd % && npm run build && sed -i "s:../../../../shared/node_modules/:./node_modules/:g" public/dist/element.bundle.js'

#&& sed -i "s:../../../../node_modules/:./node_modules/:g" public/dist/element.bundle.js'