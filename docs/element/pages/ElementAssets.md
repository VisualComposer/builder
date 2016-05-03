## Element Assets
There are 3 types of component assets:
- Public asset or libs
- Private asset or files that can be used only inside an element
- Editor assets.

### Public assets
Any kind of lib that can be loaded via public source. They stored in one place inside element folder and can be reused by another component
Has so called name convention "{lib-name}-v{version}"

#### Configurations
  {
    "name": "jquery-v2.2.2",
    "type": "lib-js",
    "access": "system",
    "value": "https://raw.githubusercontent.com/jquery/jquery-dist/master/dist/jquery.min.js"
  },
  {
    "name": "jquery-v2.2.2",
    "type": "lib-css",
    "access": "system",
    "value": "https://raw.githubusercontent.com/twbs/bootstrap/master/dist/css/bootstrap.min.css"
  }
### Private assets
Javascript/CSS required for element should be placed inside public directory of th element folder.
Name of the file should be the same as a name of the settings attribute.
#### Configurations
  {
    "name": "exampleButton",
    "type": "js",
    "access": "system",
    "value": "public/exampleButton.js"
  },
  {
    "name": "exampleButton",
    "type": "css",
    "access": "system",
    "value": "public/exampleButton.css"
  }
All kind of assets like images, fonts should be placed inside public folder too.

###  Editor assets
If component requires special interaction settings based on js/css or any another asset should be placed in editor folder.
#### Configurations
  {
    "name": "exampleButton",
    "type": "editor-js",
    "access": "system",
    "value": "editor/exampleButton.js"
  },

