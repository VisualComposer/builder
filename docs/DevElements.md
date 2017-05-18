## Localy Clone and Build elements
All elements are cloned from gitlab repository (group visualcomposer-hub)

### ENV variable
`.env` file variable
__VCV_DEV_ELEMENTS=true__

### MAC
Scripts for clone elements and update if exists:
* `bash tools/devElements/cloneScript.sh` - will clone all Lite version elements into devElements folder, in case if folder exists `git pull` will be run.
* `bash tools/devElements/buildScriptMac.sh` - will run webpack build and `../../node_modules` replace (via sed -i '')

### WINDOWS
Scripts for clone elements and update for WINDOWS:
* `bash tools/devElements/cloneScript.sh`
* `bash tools/devElements/buildScriptWindow.sh`

___
### Other commands
* `bash tools/devElements/statusScript.sh` - For check status (is there any update for element available)

