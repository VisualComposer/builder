<?php
/** overrides */
define('VCV_VERSION', 'tools');
define('VCV_DEBUG', false);

class ComposerHooks
{
    static public function postInstallCmd($event)
    {
        self::generateMetaFile();
    }

    static public function postUpdateCmd($event)
    {
        self::generateMetaFile();
    }

    static public function generateMetaFile()
    {
        $bindings = [];

        $app = new \VisualComposer\Framework\Application(realpath(__DIR__ . '/..') . '/');
        $autoload = new \VisualComposer\Framework\Autoload($app, false);

        $components = $autoload->getComponents();
        // Add aliases
        $components['helpers']['EventsHelper'] = [
            'abstract' => 'VisualComposer\\Helpers\\Events',
        ];
        $components['helpers']['FiltersHelper'] = [
            'abstract' => 'VisualComposer\\Helpers\\Filters',
        ];
        foreach (array_merge($components['helpers'], $components['modules']) as $name => $component) {
            $bindings[ $name ] = $component['abstract'];
        }

        ob_start();
        $methods = [
            '\VisualComposer\Framework\Illuminate\Container\Container::make(\'\')',
            '\vcapp(\'\')',
        ];
        include 'views/meta.php';
        $contents = ob_get_clean();
        file_put_contents(__DIR__ . '/..' . '/.phpstorm.meta.php', $contents);
    }
}