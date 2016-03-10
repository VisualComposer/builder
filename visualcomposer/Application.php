<?php

namespace VisualComposer;

use VisualComposer\Framework\Application as ApplicationFactory;

class Application extends ApplicationFactory
{
    public $modules = [
        // system s & subs
        'activation' => 'VisualComposer\Modules\System\Activation\Controller',
        'textDomain' => 'VisualComposer\Modules\System\TextDomain\Controller',

        // Editors s & subs
        'assetsManager' => 'VisualComposer\Modules\Editors\AssetsManager\Controller',
        'dataAjax' => 'VisualComposer\Modules\Editors\DataAjax\Controller',
        // Live/Public
        'live' => 'VisualComposer\Modules\Live\Controller',

        // Elements
        'ajaxElementRender' => 'VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller',

        // License
        'license' => 'VisualComposer\Modules\License\Controller',

        // Settings
        'settings' => 'VisualComposer\Modules\Settings\Controller',
        'settingsPageGeneral' => 'VisualComposer\Modules\Settings\Pages\General',
        'settingsPageLicense' => 'VisualComposer\Modules\Settings\Pages\License',
        'settingsPageRoles' => 'VisualComposer\Modules\Settings\Pages\Roles',
        'settingsPageAbout' => 'VisualComposer\Modules\Settings\Pages\About',

        // Access
        'currentUserAccess' => 'VisualComposer\Modules\Access\CurrentUser\Access',
        'roleAccess' => 'VisualComposer\Modules\Access\Role\Access',

        'frontendEditor' => 'VisualComposer\Modules\Editors\Frontend\Frontend',
        'pageEditable' => 'VisualComposer\Modules\Editors\Frontend\PageEditable',

    ];
    public $helpers = [
        // Generic
        'coreHelper' => 'VisualComposer\Helpers\Generic\Core',
        'dataHelper' => 'VisualComposer\Helpers\Generic\Data',
        'requestHelper' => 'VisualComposer\Helpers\Generic\Request',
        'templatesHelper' => 'VisualComposer\Helpers\Generic\Templates',
        'urlHelper' => 'VisualComposer\Helpers\Generic\Url',
        /// WordPress
        'fileHelper' => 'VisualComposer\Helpers\Wordpress\File',
        'nonceHelper' => 'VisualComposer\Helpers\Wordpress\Nonce',
        'optionsHelper' => 'VisualComposer\Helpers\Wordpress\Options',
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
