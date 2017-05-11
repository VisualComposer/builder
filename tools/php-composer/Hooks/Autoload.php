<?php

namespace ComposerHooks\Hooks;

use VisualComposer\Framework\Application;

class Autoload
{
    /**
     * Used in bitwise comparison.
     */
    const CLASS_START = 1;

    /**
     * Used in bitwise comparison.
     */
    const CLASS_START_STRING = 2;

    /** @var  Application */
    public static $app;

    public static function call()
    {
        self::$app = new Application(realpath(__DIR__ . '/../../..') . '/');
        $all = self::getComponents();
        self::saveComponents($all);
    }

    /**
     * @param $all
     */
    private static function saveComponents($all)
    {
        $filename = self::$app->path('cache/autoload.php');
        $autoloadFilesExport = var_export($all, true);

        $fileData = <<<DATA
<?php

return $autoloadFilesExport;
DATA;
        file_put_contents($filename, $fileData);
    }

    /**
     * @return array
     */
    public static function getComponents()
    {
        $components = self::$app->rglob(self::$app->path('visualcomposer/*/*.php'));
        $all = [
            'helpers' => [],
            'modules' => [],
        ];
        foreach ($components as $componentPath) {
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
                    ];
                } elseif (self::isModule($data['implements'])) {
                    $name = self::getModuleName($data);
                    $all['modules'][ $name ] = [
                        'name' => $name,
                        'abstract' => $data['namespace'] . "\\" . $data['class'],
                        'make' => true,
                        'singleton' => true,
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
    public static function isHelper($implements)
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
    public static function isImmutable($implements)
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
    public static function isModule($implements)
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
    protected static function checkTokens($tokens)
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
                        $data['start']['class'] = self::CLASS_START;
                        break;
                    default:
                        $data = self::checkKey($key, $token[1], $data);
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
    protected static function checkKey($key, $value, $data)
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
    public static function getHelperName($data)
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
    public static function getModuleName($data)
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
