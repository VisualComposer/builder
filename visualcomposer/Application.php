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
     *  - It will be automatically instatiated after `vcv:load` action
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
        'settingsPageHub' => 'VisualComposer\Modules\Settings\Pages\Hub',
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
        'tokenHelper' => 'VisualComposer\Helpers\WordPress\Token',
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
     *
     * @param  string|null $basePath
     *
     * @noinspection PhpMissingParentConstructorInspection
     */
    public function __construct($basePath = null)
    {
        $this->basePath = $basePath;
        $this->bootstrapContainer();
        do_action('vcv:load', $this);
    }

    /**
     * Bootstraps registred modules( also creates an instance )
     * And saves helpers as singletons
     *
     * @return $this
     */
    public function boot()
    {
        // Do the boot!
        do_action('vcv:booting', $this);
        $this->bootHelpers()->bootAutoload()->bootModules();
        do_action('vcv:boot', $this);

        return $this;
    }

    /**
     * @return $this
     */
    protected function bootAutoload()
    {
        $app = $this; // used in require
        $autoloadFiles = $this->getAutoloadFiles();

        if (is_array($autoloadFiles)) {
            foreach ($autoloadFiles as $file) {
                /** @var $app Application */
                require $file;
            }
        }

        return $app;
    }

    /**
     * @return $this
     */
    protected function bootHelpers()
    {
        if (is_array($this->helpers)) {
            foreach ($this->helpers as $helper) {
                $this->singleton($helper, $helper);
            }
        }

        return $this;
    }

    /**
     * @return $this
     */
    protected function bootModules()
    {
        if (is_array($this->modules)) {
            foreach ($this->modules as $module) {
                $this->singleton($module, $module);
                $this->make($module);
            }
        }

        return $this;
    }

    /**
     * Get the version number of the application.
     *
     * @return string
     */
    public function version()
    {
        return VCV_VERSION;
    }

    /**
     * Register the core container aliases.
     * Used in Dependency Injection
     * @see \docs\php\DependencyInjection.md
     *
     * @return $this
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

        return $this;
    }

    /**
     * Register container bindings for the application.
     *
     * @return $this
     */
    protected function registerEventBindings()
    {
        $this->singleton(
            'eventsHelper',
            function ($app) {
                return (new Dispatcher($app));
            }
        );

        return $this;
    }

    /**
     * @param $pattern - file pattern to search
     * @param int $flags
     *
     * @return mixed
     */
    public function rglob($pattern, $flags = 0)
    {
        $files = glob(apply_filters('vcv:application:rglob', $pattern), $flags);
        foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
            $files = array_merge($files, $this->rglob($dir . '/' . basename($pattern), $flags));
        }

        return $files;
    }

    /**
     * Public api to register module
     *
     * @param $name
     * @param $controller
     *
     * @return $this
     */
    public function addModule($name, $controller)
    {
        $this->addCompontent(strtolower($name), $controller, true);

        return $this;
    }

    /**
     * Public api to register helper
     *
     * @param $name
     * @param $controller
     *
     * @return $this
     */
    public function addHelper($name, $controller)
    {
        $this->addCompontent(strtolower($name) . 'Helper', $controller, false);

        return $this;
    }

    /**$this->addCompontent($moduleName, $moduleController, true);
     *
     * @param $componentName
     * @param $componentController
     * @param bool $make
     *
     * @return $this
     */
    public function addCompontent($componentName, $componentController, $make = true)
    {
        $this->singleton($componentController);
        $this->addAlias($componentName, $componentController);
        if ($make) {
            $this->make($componentController);
        }

        return $this;
    }

    /**
     * Add component Alias
     *
     * @param $key
     * @param $value
     *
     * @return $this
     */
    public function addAlias($key, $value)
    {
        $this->aliases[ $key ] = $value;

        return $this;
    }

    /**
     * @return mixed
     */
    private function getAutoloadFiles()
    {
        $filename = $this->path('cache/autoload-' . VCV_VERSION . '.php');
        if (!VCV_DEBUG
            && (file_exists(
                $filename
            ))
        ) {
            $autoloadFiles = require $filename;

            return $autoloadFiles;
        } else {
            $autoloadFiles = $this->rglob($this->path('visualcomposer/*/autoload.php'));
            $this->saveAutoloadFiles($autoloadFiles);

            return $autoloadFiles;
        }
    }

    /**
     * @param $autoloadFiles
     *
     * @return $this
     */
    private function saveAutoloadFiles($autoloadFiles)
    {
        $filename = $this->path('cache/autoload-' . VCV_VERSION . '.php');
        $autoloadFilesExport = var_export($autoloadFiles, true);

        $fileData = <<<DATA
<?php

return $autoloadFilesExport;
DATA;
        file_put_contents($filename, $fileData);

        return $this;
    }

    /**
     * Get plugin dir path + custom dir
     *
     * @param $path
     *
     * @return string
     */
    public function path($path = '')
    {
        return apply_filters('vcv:application:path', $this->basePath . ltrim($path, '\//'));
    }
}
