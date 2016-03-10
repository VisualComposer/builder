<?php

namespace VisualComposer;

class Application extends \VisualComposer\Framework\Application
{
    public $modules = [
        // system modules & submodules
        'VisualComposer\Modules\System\Activation\Controller',
        'VisualComposer\Modules\System\TextDomain\Controller',

        // Editors modules & submodules
        'VisualComposer\Modules\Editors\AssetsManager\Controller',
        'VisualComposer\Modules\Editors\DataAjax\Controller',
        'VisualComposer\Modules\Live\Controller',

        // Elements
        'VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller',

        // License
        'VisualComposer\Modules\License\Controller',

        // Settings
        'VisualComposer\Modules\Settings\Controller',
        'VisualComposer\Modules\Settings\Pages\General',
        'VisualComposer\Modules\Settings\Pages\License',
        'VisualComposer\Modules\Settings\Pages\Roles',
        'VisualComposer\Modules\Settings\Pages\About',

        // Access
        'VisualComposer\Modules\Access\CurrentUser\Access',
        'VisualComposer\Modules\Access\Role\Access',

        'VisualComposer\Modules\Editors\Frontend\Frontend',
        'VisualComposer\Modules\Editors\Frontend\PageEditable',

    ];
    public $helpers = [
        // Generic
        'VisualComposer\Helpers\Generic\Core',
        'VisualComposer\Helpers\Generic\Data',
        'VisualComposer\Helpers\Generic\Events',
        'VisualComposer\Helpers\Generic\Request',
        'VisualComposer\Helpers\Generic\Templates',
        'VisualComposer\Helpers\Generic\Url',
        /// WordPress
        'VisualComposer\Helpers\Wordpress\File',
        'VisualComposer\Helpers\Wordpress\Nonce',
        'VisualComposer\Helpers\Wordpress\Options',
    ];
    /**
     * The available container bindings and their respective load methods.
     *
     * @var array
     */
    public $availableBindings = [
        'VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher' => 'registerEventBindings',
        'events' => 'registerEventBindings',
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
        do_action('vc:v:load', $this);
    }

    public function boot()
    {
        if (is_array($this->modules)) {
            foreach ($this->modules as $module) {
                $this->singleton($module, $module);
                $this->make($module);
            }
        }
        do_action('vc:v:boot', $this);
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
     * Register the core container aliases.
     *
     * @return void
     */
    protected function registerContainerAliases()
    {
        $this->aliases = [
                //'VisualComposer\Framework\Illuminate\Contracts\Foundation\Application' => 'app',
                //'VisualComposer\Framework\Illuminate\Container\Container' => 'app',
                // 'VisualComposer\Framework\Illuminate\Contracts\Container\Container' => 'app',
                'VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher' => 'events',
            ] + $this->modules + $this->helpers;
    }

    /**
     * Register container bindings for the application.
     *
     * @return void
     */
    protected function registerEventBindings()
    {
        $this->singleton(
            'events',
            function () {
                $this->register('VisualComposer\Framework\Illuminate\Events\EventServiceProvider');

                return $this->make('events');
            }
        );
    }
}
