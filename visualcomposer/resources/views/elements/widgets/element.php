<?php
$wpWidgets = vchelper('WpWidgets');
$groups = $wpWidgets->allGrouped();
$scripts = [];
if (!empty($groups['default'])) {
    $scripts['WpWidgetsDefault'] = $wpWidgets->getTemplateVariables(
        [
            'name' => 'Default WordPress Widget',
        ],
        $groups['default']
    );
}
if (!empty($groups['custom'])) {
    $scripts['WpWidgetsCustom'] = $wpWidgets->getTemplateVariables(
        [
            'name' => 'Custom WordPress Widget',
        ],
        $groups['custom']
    );
}

$template = file_get_contents(vcapp()->path('public/dist/element-widgets.bundle.js'));
foreach ($scripts as $key => $templateVariables) {
    $compiledTemplate = $template;
    // Webpack: unset ID
    $compiledTemplate = preg_replace('/webpackJsonp\(\[\d+\]/', 'webpackJsonp([\'' . $key . '\']', $compiledTemplate);
    // TAG: replacement
    $compiledTemplate = str_replace('"value": "widgets"', '"value": "' . $key . '"', $compiledTemplate);

    // Other variables
    foreach ($templateVariables as $variableKey => $variableValue) {
        $encodedValue = is_string($variableValue) ? $variableValue : json_encode($variableValue);
        $compiledTemplate = str_replace('{' . $variableKey . '}', $encodedValue, $compiledTemplate);
        $compiledTemplate = str_replace('"{+' . $variableKey . '+}"', $encodedValue, $compiledTemplate);
    }
    echo $compiledTemplate;
}
