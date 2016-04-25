<?php

namespace VisualComposer\Framework;

use VisualComposer\Application as ApplicationVc;

/**
 * Class Autoload
 */
class Autoload
{
    /**
     * Used in bitwise comparison
     */
    const CLASS_START = 1;
    /**
     * Used in bitwise comparison
     */
    const CLASS_START_STRING = 2;
    /** @var  ApplicationVc */
    private $app;

    /**
     * Autoload constructor
     *
     * @param \VisualComposer\Application $app
     */
    public function __construct(ApplicationVc $app)
    {
        $this->app = $app;
        if (VCV_DEBUG) {
            $all = $this->getComponents();
            $this->initComponents($all);
            $this->saveComponents($all);
        } else {
            $this->useCache();
        }
    }

    /**
     * @param $all
     *
     * @return $this
     */
    private function saveComponents($all)
    {
        $filename = $this->app->path('cache/autoload-' . VCV_VERSION . '.php');
        $autoloadFilesExport = var_export($all, true);

        $fileData = <<<DATA
<?php

return $autoloadFilesExport;
DATA;
        file_put_contents($filename, $fileData);

        return $this;
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
                $this->app->addComponent($component['name'], $component['abstract'], $component['make']);
            }

            return true;
        }

        return false;
    }

    /**
     * @return array
     */
    public function getComponents()
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
                if ($this->isHelper($data['implements'])) {
                    $name = $this->getHelperName($data);
                    $all['helpers'][ $name ] = [
                        'name' => $name,
                        'abstract' => $data['namespace'] . "\\" . $data['class'],
                        'make' => false,
                    ];
                } elseif ($this->isModule($data['implements'])) {
                    $name = $this->getModuleName($data);
                    $all['modules'][ $name ] = [
                        'name' => $name,
                        'abstract' => $data['namespace'] . "\\" . $data['class'],
                        'make' => true,
                    ];
                }
            }
        }
        if (defined('VCV_DEBUG') && VCV_DEBUG && defined('VCV_DEBUG_AUTOLOAD_RANDOM') && VCV_DEBUG_AUTOLOAD_RANDOM) {
            $all['helpers'] = $this->shuffleAssoc($all['helpers']);
            $all['modules'] = $this->shuffleAssoc($all['modules']);

            return $all;
        }

        return $all;
    }

    /**
     * Shuffles and array with keys
     *
     * @param $array
     *
     * @return array
     */
    private function shuffleAssoc($array)
    {
        $keys = array_keys($array);

        shuffle($keys);
        $new = [];
        foreach ($keys as $key) {
            $new[ $key ] = $array[ $key ];
        }

        return $new;
    }

    /**
     * @param $implements
     *
     * @return bool
     */
    private function isHelper($implements)
    {
        return in_array(
            $implements,
            [
                'Helper',
                '\VisualComposer\Framework\Illuminate\Support\Helper',
                '\\VisualComposer\\Framework\\Illuminate\\Support\\Helper',
            ]
        );
    }

    /**
     * @param $implements
     *
     * @return bool
     */
    private function isModule($implements)
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

    /**
     * @return bool
     */
    protected function useCache()
    {
        $filename = $this->app->path('cache/autoload-' . VCV_VERSION . '.php');
        if (file_exists($filename)) {
            /** @noinspection PhpIncludeInspection */
            $all = require $filename;

            $this->initComponents($all);

            return true;
        }

        return false;
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    private function getHelperName($data)
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
    private function getModuleName($data)
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
