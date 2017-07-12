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

class ElementsAutoload extends Autoload implements Module
{
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
        if ($init) {
            $components = $this->getComponents();
            $this->bootstrapFiles($components);
            $this->initComponents($components);
            $this->bootComponents($components);
        }
    }

    protected function bootstrapFiles($components)
    {
        if (!empty($components['modules'])) {
            foreach ($components['modules'] as $module) {
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
        /** @var \VisualComposer\Framework\Application $appHelper */
        $appHelper = vcapp();

        foreach ($hubHelper->getElements() as $key => $element) {
            if (isset($element['elementRealPath'])) {
                $components = $appHelper->rglob(rtrim($element['elementRealPath'], '\//') . '/*.php');
                $all = array_merge_recursive($all, $this->checkElementController($components));
            }
        }

        return $all;
    }

    protected function checkElementController($components)
    {
        $all = [
            'helpers' => [],
            'modules' => [],
        ];
        foreach ($components as $componentPath) {
            $tokens = token_get_all(file_get_contents($componentPath));
            $data = self::checkTokens($tokens);
            if (!empty($data['namespace']) && !empty($data['class']) && !empty($data['implements'])) {
                if (self::isModule($data['implements'])) {
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
    protected function isModule($implements)
    {
        return in_array(
            $implements,
            [
                'Module',
                '\VisualComposer\Framework\Illuminate\Support\Module',
                '\\VisualComposer\\Framework\\Illuminate\\Support\\Module',
            ]
        );
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
            'implements' => '',
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
                    $data['start']['implements'] = false;
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
                    $data['implements'] .= $value;
                }
                break;
            case T_NS_SEPARATOR:
                if ($data['start']['namespace']) {
                    $data['namespace'] .= $value;
                } elseif ($data['start']['implements']) {
                    $data['implements'] .= $value;
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
}
