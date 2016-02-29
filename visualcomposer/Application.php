<?php

namespace VisualComposer;

class Application extends \Laravel\Lumen\Application
{
    public $modules = [
        // system modules & submodules
        'ActivationController' => 'VisualComposer\Modules\System\Activation\ActivationController',
        'ActivationListener' => 'VisualComposer\Modules\System\Activation\ActivationListener',
        'TextDomainController' => 'VisualComposer\Modules\System\TextDomain\TextDomainController',
        // Editors modules & submodules
        'AssetsManagerController' => 'VisualComposer\Modules\Editors\AssetsManager\AssetsManagerController',
        'DataAjaxController' => 'VisualComposer\Modules\Editors\DataAjax\DataAjaxController',
        'FrontController' => 'VisualComposer\Modules\Front\FrontController',
        // Elements
        'AjaxShortcodeRenderController' => 'VisualComposer\Modules\Elements\AjaxShortcodeRender\AjaxShortcodeRenderController',
        'Frontend' => 'VisualComposer\Modules\Editors\Frontend\Frontend',
        'PageEditable' => 'VisualComposer\Modules\Editors\Frontend\PageEditable',
    ];

    /**
     * Create a new Lumen application instance.
     *
     * @overrides parent::__construct()
     *
     * @param  string|null $basePath
     */
    public function __construct($basePath = null)
    {
        $this->basePath = $basePath;
        $this->bootstrapContainer();
        do_action('vc:v:load');
    }

    public function boot()
    {
        foreach ($this->modules as $moduleName => $module) {
            $this->singleton($moduleName, $module);
            $this->make($moduleName);
        }
        do_action('vc:v:init');
    }

    /**
     * Get the version number of the application.
     *
     * @return string
     */
    public function version()
    {
        return VC_V_VERSION;
    }

    /**
     * Get the HTML from the welcome screen.
     *
     * @return string
     */
    public function welcome()
    {
        return 'Visual Composer';
    }
}