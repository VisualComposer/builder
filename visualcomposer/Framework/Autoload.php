<?php

namespace VisualComposer\Framework;

use VisualComposer\Framework\Application as ApplicationVc;

/**
 * Class Autoload.
 */
class Autoload extends Container
{
    /** @var  ApplicationVc */
    private $app;

    /**
     * Autoload constructor.
     *
     * @param \VisualComposer\Framework\Application $app
     * @param bool $init
     */
    public function __construct(ApplicationVc $app, $init = true)
    {
        $this->app = $app;
        if ($init) {
            $this->init();
        }
    }

    public function init()
    {
        return $this->useCache();
    }

    /**
     * @param $all
     *
     * @return bool
     */
    public function initComponents($all)
    {
        if (is_array($all) && is_array($all['helpers']) && is_array($all['modules'])) {
            foreach (array_merge($all['helpers'], $all['modules']) as $component) {
                $this->app->addComponent(
                    $component['name'],
                    $component['abstract'],
                    $component['make'],
                    $component['singleton']
                );
            }

            return true;
        }

        return false;
    }

    /**
     * @return bool
     */
    public function useCache()
    {
        $filename = $this->app->path('cache/autoload.php');
        if (file_exists($filename)) {
            /** @noinspection PhpIncludeInspection */
            $all = require $filename;
            $this->initComponents($all);

            return true;
        }

        return false;
    }
}
