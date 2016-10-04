<?php
namespace ComposerHooks\Hooks;

use VisualComposer\Framework\Application;

class Meta
{
    static public function call()
    {
        $bindings = [];

        $app = new Application(realpath(__DIR__ . '/../../..') . '/');
        Autoload::$app = $app;
        $components = Autoload::getComponents();
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
            '\VisualComposer\Framework\Illuminate\Contracts\Container\Container::make(\'\')',
            '\VisualComposer\Framework\Application::make(\'\')',
            '\VisualComposer\Application::make(\'\')',
            '\VisualComposer\Framework\Illuminate\Container\Container::make(\'\')',
            '\vcapp(\'\')',
        ];
        include __DIR__ . '/../views/meta.php';
        $contents = ob_get_clean();
        file_put_contents(__DIR__ . '/../../..' . '/.phpstorm.meta.php', $contents);

        return $contents;
    }
}
