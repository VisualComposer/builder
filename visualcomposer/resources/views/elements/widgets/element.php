<?php
$wpWidgets = vchelper('WpWidgets');
$groups = $wpWidgets->allGrouped();
if (!empty($groups['default'])) {
    $variables = $wpWidgets->getTemplateVariables(
        [
            'name' => 'WordPress Widgets',
        ],
        $groups['default']
    );
    $template = file_get_contents(vcapp()->path('public/dist/element-_WpWidgetsDefault.bundle.js'));
    echo $wpWidgets->compileTemplate($template, 'WpWidgetsDefault', $variables);
}
if (!empty($groups['custom'])) {
    $variables = $wpWidgets->getTemplateVariables(
        [
            'name' => 'Custom Widgets',
        ],
        $groups['custom']
    );
    $template = file_get_contents(vcapp()->path('public/dist/element-_WpWidgetsCustom.bundle.js'));
    echo $wpWidgets->compileTemplate($template, 'WpWidgetsCustom', $variables);
}
