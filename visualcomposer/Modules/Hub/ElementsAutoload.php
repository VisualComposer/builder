<?php

namespace VisualComposer\Modules\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Autoload;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Application as ApplicationVc;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ElementsAutoload extends Autoload implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Used in bitwise comparison.
     */
    protected $classStart = 1;

    /**
     * Used in bitwise comparison.
     */
    protected $classStartString = 2;

    public function __construct(ApplicationVc $app, $init = true)
    {
        $this->app = $app;
        $this->wpAddAction(
            'init',
            function () use ($init) {
                if ($init) {
                    $components = $this->getComponents();
                    $this->doComponents($components);
                }
            },
            11
        );
        $this->addEvent(
            'vcv:hub:elements:autoload',
            function ($element) {
                $components = $this->getSingleComponent($element);
                $this->doComponents($components);
            }
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
     * @return array
     */
    protected function getComponents()
    {
        $hubHelper = vchelper('HubElements');
        $all = [
            'helpers' => [],
            'modules' => [],
        ];

        foreach ($hubHelper->getElements() as $key => $element) {
            if (isset($element['elementRealPath'])) {
                $all = array_merge_recursive($all, $this->getSingleComponent($element));
            }
        }

        return $all;
    }

    protected function getSingleComponent($element)
    {
        $components = $this->app->glob(rtrim($element['elementRealPath'], '\//') . '/*.php');

        return $this->checkElementController($components);
    }

    protected function checkElementController($components)
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
        return count(
            array_intersect(
                (array)$implements,
                [
                    'Helper',
                    '\VisualComposer\Framework\Illuminate\Support\Helper',
                    '\\VisualComposer\\Framework\\Illuminate\\Support\\Helper',
                ]
            )
        ) > 0;
    }

    /**
     * @param $implements
     *
     * @return bool
     */
    protected static function isImmutable($implements)
    {
        return count(
            array_intersect(
                (array)$implements,
                [
                    'Immutable',
                    '\VisualComposer\Framework\Illuminate\Support\Immutable',
                    '\\VisualComposer\\Framework\\Illuminate\\Support\\Immutable',
                ]
            )
        ) > 0;
    }

    /**
     * @param $implements
     *
     * @return bool
     */
    protected function isModule($implements)
    {
        return count(
            array_intersect(
                (array)$implements,
                [
                    'Module',
                    '\VisualComposer\Framework\Illuminate\Support\Module',
                    '\\VisualComposer\\Framework\\Illuminate\\Support\\Module',
                ]
            )
        ) > 0;
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
                        $data['start']['class'] = $this->classStart;
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
     */
    protected function checkKey($key, $value, $data)
    {
        switch ($key) {
            case T_WHITESPACE:
                if ($data['start']['class'] & $this->classStart
                    && $data['start']['class'] & $this->classStartString
                ) {
                    $data['start']['class'] = 0;
                }
                break;
            case T_STRING:
                if ($data['start']['namespace']) {
                    $data['namespace'] .= $value;
                } elseif ($data['start']['class']) {
                    $data['start']['class'] = $this->classStart + $this->classStartString;
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

    /**
     * @param $components
     */
    protected function doComponents($components)
    {
        $this->bootstrapFiles($components);
        $this->initComponents($components);
        $this->bootComponents($components);
    }
}
