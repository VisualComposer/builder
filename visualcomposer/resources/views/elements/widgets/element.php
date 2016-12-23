<?php
$wpWidgets = vchelper('WpWidgets');
$groups = $wpWidgets->allGrouped();
if (!empty($groups['default'])) {
    $variables = $wpWidgets->getTemplateVariables(
        [
            'name' => 'Default WordPress Widget',
        ],
        $groups['default']
    );
    $template = file_get_contents(vcapp()->path('public/dist/element-_WpWidgetsDefault.bundle.js'));
    echo $wpWidgets->compileTemplate($template, 'WpWidgetsDefault', $variables);
}
if (!empty($groups['custom'])) {
    $variables = $wpWidgets->getTemplateVariables(
        [
            'name' => 'Custom WordPress Widget',
        ],
        $groups['custom']
    );
    $template = file_get_contents(vcapp()->path('public/dist/element-_WpWidgetsCustom.bundle.js'));
    echo $wpWidgets->compileTemplate($template, 'WpWidgetsCustom', $variables);
}
