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
            if (array_key_exists($key, $this->data)) {
                $mergedValue = is_array($this->data[ $key ])
                    ? array_unique(
                        (array)$newValue[ $key ]
                        + $this->data[ $key ] // Union of $this->data and $newValue with preserve associative keys
                    ) : $newValue[ $key ];
            } else {
                $mergedValue = $newValue[ $key ];
            }
            if (isset($this->updateCallback)) {
                $mergedValue = call_user_func_array(
                    $this->updateCallback,
                    [
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
