<?php

namespace VisualComposer;

use VisualComposer\Framework\Application as ApplicationFactory;
use VisualComposer\Framework\Illuminate\Contracts\Foundation\Application as ApplicationContract;
use VisualComposer\Framework\Illuminate\Events\Dispatcher;

/**
 * Main plugin instance which controls modules and helpers
 * Provides Inner and Outer API with vcapp() helper
 *
 * Class Application
 * @package VisualComposer
 */
class Application extends ApplicationFactory implements ApplicationContract
{
    /**
     * List of system registred modules
     * Notes:
     *  - It will be singletons
     *  - It will be automatically instatiated after `vc:v:load` action
     *  - It was available by moduleNmae -> vcapp('settings')
     * @see \docs\php\Readme.md and \docs\php\Modules.md
     * @var array
     */
    public $modules = [
        // system s & subs
        'activation' => 'VisualComposer\Modules\System\Activation\Controller',
        'textDomain' => 'VisualComposer\Modules\System\TextDomain\Controller',
        // Editors s & subs
        'assetsManager' => 'VisualComposer\Modules\Editors\AssetsManager\Controller',
        'dataAjax' => 'VisualComposer\Modules\Editors\DataAjax\Controller',
        'frontendEditor' => 'VisualComposer\Modules\Editors\Frontend\Frontend',
        'pageEditable' => 'VisualComposer\Modules\Editors\Frontend\PageEditable',
        // Live/Public
        'site' => 'VisualComposer\Modules\Site\Controller',
        // Elements
        'ajaxElementRender' => 'VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller',
        // License
        'license' => 'VisualComposer\Modules\License\Controller',
        // Settings & Settings Pages
        'settings' => 'VisualComposer\Modules\Settings\Controller',
        'settingsPageGeneral' => 'VisualComposer\Modules\Settings\Pages\General',
        'settingsPageLicense' => 'VisualComposer\Modules\Settings\Pages\License',
        'settingsPageAuthorization' => 'VisualComposer\Modules\Settings\Pages\Authorization',
        'settingsPageRoles' => 'VisualComposer\Modules\Settings\Pages\Roles',
        'settingsPageAbout' => 'VisualComposer\Modules\Settings\Pages\About',
    ];
    /**
     * List of system registred helpers
     * Notes:
     *  - It will be singletons    *  - It was available by helperName -> vcapp('urlHelper')
     * @see \docs\php\Readme.md and \docs\php\api\API.md|Helpers.md
     * @var array
     */
    public $helpers = [
        // Generic
        'coreHelper' => 'VisualComposer\Helpers\Generic\Core',
        'dataHelper' => 'VisualComposer\Helpers\Generic\Data',
        'requestHelper' => 'VisualComposer\Helpers\Generic\Request',
        'templatesHelper' => 'VisualComposer\Helpers\Generic\Templates',
        'urlHelper' => 'VisualComposer\Helpers\Generic\Url',
        /// WordPress
        'fileHelper' => 'VisualComposer\Helpers\WordPress\File',
        'nonceHelper' => 'VisualComposer\Helpers\WordPress\Nonce',
        'optionsHelper' => 'VisualComposer\Helpers\WordPress\Options',
        // Other helpers
        'currentUserAccessHelper' => 'VisualComposer\Helpers\Generic\Access\CurrentUser\Access',
        'roleAccessHelper' => 'VisualComposer\Helpers\Generic\Access\Role\Access',
    ];
    /**
     * The available container bindings and their respective load methods.
     *
     * @var array
     */
    public $availableBindings = [
        'VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher' => 'registerEventBindings',
        'eventsHelper' => 'registerEventBindings',
    ];

    /**
     * Create a new Application instance.
     *
     * @overrides parent::__construct()
     * @param  string|null $basePath
     * @noinspection PhpMissingParentConstructorInspection
     */
    public function __construct($basePath = null)
    {
        $this->basePath = $basePath;
        $this->bootstrapContainer();
        do_action('vc:v:load', $this);
    }

    /**
     * Bootstraps registred modules( also creates an instance )
     * And saves helpers as singletons
     */
    public function boot()
    {
        if (is_array($this->modules)) {
            foreach ($this->modules as $module) {
                $this->singleton($module, $module);
                $this->make($module);
            }
        }
        if (is_array($this->helpers)) {
            foreach ($this->helpers as $helper) {
                $this->singleton($helper, $helper);
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
     * Used in Dependency Injection
     * @see \docs\php\DependencyInjection.md
     *
     * @return void
     */
    protected function registerContainerAliases()
    {
        $this->aliases = [
                'VisualComposer\Framework\Application' => 'app',
                'VisualComposer\Framework\Illuminate\Contracts\Foundation\Application' => 'app',
                'VisualComposer\Framework\Illuminate\Container\Container' => 'app',
                'VisualComposer\Framework\Illuminate\Contracts\Container\Container' => 'app',
                'VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher' => 'eventsHelper',
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
            'eventsHelper',
            function ($app) {
                return (new Dispatcher($app));
            }
        );
    }
}
