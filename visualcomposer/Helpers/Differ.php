<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Illuminate\Support\Immutable;

class Differ extends Container implements Helper, Immutable
{
    protected $data = [];

    protected $updateCallback;

    protected $mergeByReplace = false;

    public function onUpdate(callable $callback)
    {
        $this->updateCallback = $callback;

        return $this;
    }

    public function optionMergeByReplace($bool)
    {
        $this->mergeByReplace = $bool;
    }

    public function set($newValue)
    {
        if ($this->data !== $newValue && is_array($newValue)) {
            $this->merge($newValue);
        }

        return $this;
    }

    public function get()
    {
        return $this->data;
    }

    protected function merge(array $newValue)
    {
        $newKeys = array_keys($newValue);
        $newAssoc = $this->hasStringKeys($newValue);
        if (!empty($newValue) && !$newAssoc) {
            throw new \InvalidArgumentException('New value must be an associative array');
        }
        $dataHelper = vchelper('Data');
        foreach ($newKeys as $key) {
            $mergedValue = $newValue[ $key ];
            if (array_key_exists($key, $this->data) && !$this->mergeByReplace) {
                if (is_array($this->data[ $key ])) {
                    $unionValue = (array)$newValue[ $key ] + $this->data[ $key ];
                    if ($this->hasStringKeys($unionValue)) {
                        $mergedValue = $unionValue;
                    } else {
                        $mergedValue = $dataHelper->arrayDeepUnique(
                            $unionValue
                        );
                    }
                }
            }
            if (!empty($this->updateCallback)) {
                $mergedValue = call_user_func_array(
                    $this->updateCallback,
                    array_values(
                        [
                            'key' => $key,
                            'oldValue' => array_key_exists($key, $this->data) ? $this->data[ $key ] : [],
                            'newValue' => $newValue[ $key ],
                            'mergedValue' => $mergedValue,
                        ]
                    )
                );
            }
            if (!empty($mergedValue)) {
                $this->data[ $key ] = $mergedValue;
            }
        }

        return $this;
    }
}
