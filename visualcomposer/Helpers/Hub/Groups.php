<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Groups implements Helper
{
    public function getGroups()
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->get(
            'hubGroups',
            [
                'All' =>
                    [
                        'title' => 'All',
                        'categories' => true,
                        'metaOrder' => 1,
                    ],
            ]
        );
    }

    public function setGroups($groups = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubGroups', $groups);
    }

    public function updateGroup($key, $prev, $new, $merged)
    {
        $dataHelper = vchelper('Data');
        if (!empty($prev)) {
            if (isset($new['categories']) && is_array($new['categories']) && isset($prev['categories'])
            ) {
                $merged['categories'] = array_values(
                    $dataHelper->arrayDeepUnique(array_merge($prev['categories'], $new['categories']))
                );
            }
        }

        return $merged;
    }
}
