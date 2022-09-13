<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
$outputHelper = vchelper('Output');
$variables = vcfilter(
    'vcv:wp:dashboard:variables',
    [
        [
            'key' => 'VCV_SLUG',
            'value' => $slug,
            'type' => 'constant',
        ],
    ],
    ['slug' => $slug]
);
if (is_array($variables)) {
    foreach ($variables as $variable) {
        if (is_array($variable) && isset($variable['key'], $variable['value'])) {
            $variableType = isset($variable['type']) ? $variable['type'] : 'variable';
            evcview('partials/variableTypes/' . $variableType, $variable);
        }
    }
    unset($variable);
}

?>
<div class="wrap vcv-settings">
    <?php
    $outputHelper->printNotEscaped($content);
    ?>
</div>
