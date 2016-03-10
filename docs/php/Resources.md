#Resources
- Resources contains assets/scripts and modules views(templates)

##Engine
- Currently no template engine enabled

##CodeStyle
- We use PSR2 codestyle for templates also
- __NEVER__ use `<?= ?>` php short open echo, use `<?php echo $variable; ?>`
- Avoid to use undeclared variables, 
	prefer to append on top of file avaible variables types, e.g:
    
	    /**
	     * @var $someVariable \stdObject
	     * @var $otherVariable array
	     */
    
- Use `vcapp('helperOrModule')` helper to use other modules API or helpers API

##File structure
- views should be located simillar to modules structure
	- e.g views/moduleName/subPart/viewName.php
- Split templates in logical parts