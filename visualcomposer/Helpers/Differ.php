<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Illuminate\Support\Immutable;

class Differ extends Container implements Helper, Immutable
{
    protected $data = [];

    protected $updateCallback;

    public function onUpdate(callable $callback)
    {
        $this->updateCallback = $callback;

        return $this;
    }

    public function set($newValue)
    {
        if ($this->data !== $newValue) {
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
        if (!$newAssoc) {
            throw new \InvalidArgumentException('New value must be an associative array');
        }
        foreach ($newKeys as $key) {
            $mergedValue = $newValue[ $key ];
            if (array_key_exists($key, $this->data)) {
                if (is_array($this->data[ $key ])) {
                    $unionValue = (array)$newValue[ $key ] + $this->data[ $key ];
                    $mergedValue = array_unique($unionValue, SORT_REGULAR);
                }
            }
            if (isset($this->updateCallback)) {
                $mergedValue = call_user_func_array(
                    $this->updateCallback,
                    [
                        'key' => $key,
                        'oldValue' => array_key_exists($key, $this->data) ? $this->data[ $key ] : [],
                        'newValue' => $newValue[ $key ],
                        'mergedValue' => $mergedValue,
                    ]
                );
            }
            $this->data[ $key ] = $mergedValue;
        }

        return $this;
    }
}
