<?php

namespace VisualComposer\Framework;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Application as ApplicationVc;

/**
 * Class Autoload.
 */
class Autoload extends Container
{
    /** @var  ApplicationVc */
    protected $app;

    /**
     * Used in bitwise comparison.
     */
    protected $classStartEnum = 1;

    /**
     * Used in bitwise comparison.
     */
    protected $classStartStringEnum = 2;

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
     * @throws \Exception
     */
    public function initComponents($all)
    {
        if (is_array($all) && is_array($all['helpers']) && is_array($all['modules'])) {
            foreach (array_merge($all['helpers'], $all['modules']) as $component) {
                if (class_exists($component['abstract'])) {
                    $this->app->addComponent(
                        $component['name'],
                        $component['abstract'],
                        $component['singleton']
                    );
                } elseif (vcvenv('VCV_DEBUG')) {
                    throw new \Exception(
                        '[Failed to add] Class doesnt exists ' . $component['abstract'] . ' try composer update'
                    );
                }
            }

            return true;
        }

        return false;
    }

    /**
     * @param $all
     *
     * @return bool
     * @throws \Exception
     */
    public function bootComponents($all)
    {
        if (is_array($all) && is_array($all['helpers']) && is_array($all['modules'])) {
            foreach (array_merge($all['helpers'], $all['modules']) as $component) {
                if (class_exists($component['abstract'])) {
                    if ($component['make']) {
                        $this->app->make(
                            $component['abstract']
                        );
                    }
                } elseif (vcvenv('VCV_DEBUG')) {
                    throw new \Exception(
                        '[Failed to Make] Class doesnt exists ' . $component['abstract'] . ' try composer update'
                    );
                }
            }

            return true;
        }

        return false;
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function useCache()
    {
        $filename = $this->app->path('cache/autoload.php');
        if (file_exists($filename)) {
            /** @noinspection PhpIncludeInspection */
            $all = require $filename;
            $this->initComponents($all);
            $this->bootComponents($all);

            return true;
        }

        return false;
    }

    protected function tokenizeComponents($components)
    {
        $all = [
            'helpers' => [],
            'modules' => [],
        ];
        foreach ($components as $componentPath) {
            if (!file_exists($componentPath)) {
                continue;
            }
            $tokens = token_get_all(file_get_contents($componentPath));
            $data = self::checkTokens($tokens);
            if (!empty($data['namespace']) && !empty($data['class']) && !empty($data['implements'])) {
                if (self::isHelper($data['implements'])) {
                    $name = self::getHelperName($data);
                    $all['helpers'][ $name ] = [
                        'name' => $name,
                        'abstract' => $data['namespace'] . "\\" . $data['class'],
                        'make' => false,
                        'singleton' => !self::isImmutable($data['implements']),
                        'path' => $componentPath,
                    ];
                } elseif (self::isModule($data['implements'])) {
                    $name = self::getModuleName($data);
                    $all['modules'][ $name ] = [
                        'name' => $name,
                        'abstract' => $data['namespace'] . "\\" . $data['class'],
                        'singleton' => true,
                        'make' => true,
                        'path' => $componentPath,
                    ];
                }
            }
        }

        return $all;
    }

    /**
     * @param $implements
     *
     * @return bool
     */
    protected static function isHelper($implements)
    {
        $intersect = array_intersect(
            (array)$implements,
            [
                'Helper',
                '\VisualComposer\Framework\Illuminate\Support\Helper',
                '\\VisualComposer\\Framework\\Illuminate\\Support\\Helper',
            ]
        );

        return count($intersect) > 0;
    }

    /**
     * @param $implements
     *
     * @return bool
     */
    protected static function isImmutable($implements)
    {
        $intersect = array_intersect(
            (array)$implements,
            [
                'Immutable',
                '\VisualComposer\Framework\Illuminate\Support\Immutable',
                '\\VisualComposer\\Framework\\Illuminate\\Support\\Immutable',
            ]
        );

        return count($intersect) > 0;
    }

    /**
     * @param $implements
     *
     * @return bool
     */
    protected function isModule($implements)
    {
        $intersect = array_intersect(
            (array)$implements,
            [
                'Module',
                '\VisualComposer\Framework\Illuminate\Support\Module',
                '\\VisualComposer\\Framework\\Illuminate\\Support\\Module',
            ]
        );

        return count($intersect) > 0;
    }

    /**
     * @param $tokens
     *
     * @return array|mixed
     */
    protected function checkTokens($tokens)
    {
        $data = [
            'start' => [
                'namespace' => 0,
                'class' => 0,
                'implements' => 0,
            ],
            'class' => '',
            'namespace' => '',
            'implements' => [],
        ];
        $i = 0;
        while ($i < count($tokens) - 1) {
            $token = $tokens[ $i ];
            if (is_array($token)) {
                $key = $token[0];
                switch ($key) {
                    case T_NAMESPACE:
                        $data['start']['namespace'] = 1;
                        break;
                    case T_IMPLEMENTS:
                        $data['start']['implements'] = 1;
                        break;
                    case T_CLASS:
                        $data['start']['class'] = $this->classStartEnum;
                        break;
                    default:
                        $data = $this->checkKey($key, $token[1], $data);
                        break;
                }
            } else {
                if ($data['start']['namespace'] && $token === ';') {
                    $data['start']['namespace'] = false;
                } elseif ($data['start']['implements'] && $token === '{') {
                    $data['start']['implements'] = [];
                }
            }
            $i++;
        }

        return $data;
    }

    /**
     * @param $key
     * @param $value
     * @param $data
     *
     * @return mixed
     * @phpcs:disable Generic.Metrics.CyclomaticComplexity.TooHigh
     */
    protected function checkKey($key, $value, $data)
    {
        if (version_compare(PHP_VERSION, '8.0.0') >= 0 && $key === T_NAME_QUALIFIED && $data['start']['namespace']) {
            $data['namespace'] = $value;
        }
        switch ($key) {
            case T_WHITESPACE:
                if (
                    $data['start']['class'] & $this->classStartEnum
                    && $data['start']['class'] & $this->classStartStringEnum
                ) {
                    $data['start']['class'] = 0;
                }
                break;
            case T_STRING:
                if ($data['start']['namespace']) {
                    $data['namespace'] .= $value;
                } elseif ($data['start']['class']) {
                    $data['start']['class'] = $this->classStartEnum + $this->classStartStringEnum;
                    $data['class'] .= $value;
                } elseif ($data['start']['implements']) {
                    $data['implements'][] = $value;
                }
                break;
            case T_NS_SEPARATOR:
                if ($data['start']['namespace']) {
                    $data['namespace'] .= $value;
                } elseif ($data['start']['implements']) {
                    $data['implements'][] = $value;
                }
                break;
        }

        return $data;
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    protected static function getHelperName($data)
    {
        return str_replace(
            [
                'VisualComposer\Helpers',
                'VisualComposer\\Helpers',
                '\\', // this is \\
                "\\", // this is \
            ],
            '',
            $data['namespace'] . $data['class'] . 'Helper'
        );
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    protected function getModuleName($data)
    {
        return str_replace(
            [
                'VisualComposer\Modules',
                'VisualComposer\\Modules',
                '\\',
                "\\",
            ],
            '',
            $data['namespace'] . $data['class']
        );
    }

    protected function bootstrapFiles($components)
    {
        if (!empty($components['modules'])) {
            foreach ($components['modules'] as $module) {
                /** @noinspection PhpIncludeInspection */
                require_once($module['path']);
            }
        }
        if (!empty($components['helpers'])) {
            foreach ($components['helpers'] as $module) {
                /** @noinspection PhpIncludeInspection */
                require_once($module['path']);
            }
        }
    }

    /**
     * @param $components
     *
     * @throws \Exception
     */
    protected function doComponents($components)
    {
        $this->bootstrapFiles($components);
        $this->initComponents($components);
        $this->bootComponents($components);
    }
}
