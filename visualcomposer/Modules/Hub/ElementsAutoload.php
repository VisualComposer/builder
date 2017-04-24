<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Autoload;
use VisualComposer\Framework\Illuminate\Support\Module;

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

    /** @noinspection PhpMissingParentConstructorInspection */
    public function __construct()
    {
        // TODO: Get from Options->hub->elements
        $components = $this->getComponents();
        $this->bootstrapFiles($components);
        $this->initComponents($components);
    }

    protected function path($element = '')
    {
        return WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . ($element ? '/' . $element : '');
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
        /** @var \VisualComposer\Framework\Application $appHelper */
        $appHelper = vcapp();
        $components = $appHelper->rglob($this->path('*/*.php'));
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
