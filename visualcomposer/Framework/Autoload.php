<?php

namespace VisualComposer\Framework;

use VisualComposer\Application as ApplicationVc;

class Autoload
{
    const CLASS_START = 1;
    const CLASS_START_STRING = 2;
    /** @var  ApplicationVc */
    private $app;

    public function __construct(ApplicationVc $app)
    {
        $this->app = $app;
        $this->loadComponents();
    }

    public function loadComponents()
    {
        $components = $this->app->rglob($this->app->path('visualcomposer/*/*.php'));
        $all = [
            'helpers' => [],
            'modules' => [],
        ];
        foreach ($components as $componentPath) {
            $tokens = token_get_all(file_get_contents($componentPath));
            $data = $this->checkTokens($tokens);
            if (!empty($data['namespace']) && !empty($data['class']) && !empty($data['implements'])) {
                if (in_array(
                    $data['implements'],
                    [
                        'Helper',
                        '\VisualComposer\Framework\Illuminate\Support\Helper',
                    ]
                )) {
                    $name = str_replace(
                        ['VisualComposer\Helpers', '\\'],
                        '',
                        $data['namespace'] . $data['class'] . 'Helper'
                    );
                    $all['helpers'][] = $name;
                    $this->app->addComponent($name, $data['namespace'] . '\\' . $data['class'], false);
                } elseif (in_array(
                    $data['implements'],
                    [
                        'Module',
                        '\VisualComposer\Framework\Illuminate\Support\Module',
                    ]
                )) {
                    $name = str_replace(['VisualComposer\Modules', '\\'], '', $data['namespace'] . $data['class']);
                    $all['modules'][] = $name;
                    $this->app->addComponent($name, $data['namespace'] . '\\' . $data['class'], true);
                }
            }
        }

        return $components;
    }

    public function checkTokens($tokens)
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
                        $data['start']['class'] = self::CLASS_START;
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

    protected function checkKey($key, $value, $data)
    {
        switch ($key) {
            case T_WHITESPACE:
                if ($data['start']['class'] & self::CLASS_START
                    && $data['start']['class'] & self::CLASS_START_STRING
                ) {
                    $data['start']['class'] = 0;
                }
                break;
            case T_STRING:
                if ($data['start']['namespace']) {
                    $data['namespace'] .= $value;
                } elseif ($data['start']['class']) {
                    $data['start']['class'] = self::CLASS_START + self::CLASS_START_STRING;
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
}