# CSS components and Post-css builder


Css for Element is represented in 2 ways:

- Compiled css file for editor/accessable only for editor
- PostCss Js Object to build

PostCss is used when save data saved.


### Global options



Button

css/
	source/
		<ComponentNaeme>.less // include main file include all files.
		mixins.less*
		variables.less*
		style.less // core styles private file.



* Includable/public files for other elements.


CTA

CTA.less source:

...

...


@import (once) "../Button/css/mixins.less"
@import (once) "../Button/css/variables.less"


...


- Component has single css files with all options/ this file is used by editor to show visual representation
- Add modules as npm style inside _modules in css dir.
- All option css style should be build via mixins
- Css class name, lower case with pattern vce-{component}-{option}-{option-value}
- in modules should be:
	<Component>/
		css/
			mixins.less
			variables.less