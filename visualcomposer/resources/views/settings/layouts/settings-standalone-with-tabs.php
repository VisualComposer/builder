<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$activeTab = '';

if (isset($_GET['page'])) {
    $activeTab = esc_attr($_GET['page']);
}

$tabsHelper = vchelper('SettingsTabsRegistry');
$tabs = vcfilter('vcv:settings:tabs', $tabsHelper->all());

$tabsHtml = '';

foreach ($tabs as $tabKey => $tab) {
    $activeClass = $tabKey === $activeTab ? ' nav-tab-active' : '';
    $tabsHtml .= '<a href="?page=' . esc_attr($tabKey) . '" class="nav-tab' . esc_attr($activeClass) . '">' . esc_html__($tab['name'], 'visualcomposer') . '</a>';
}

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
            $type = isset($variable['type']) ? $variable['type'] : 'variable';
            evcview('partials/variableTypes/' . $type, $variable);
        }
    }
    unset($variable);
}
?>
<div class="wrap vcv-settings">
    <h1></h1> <!--DONT REMOVE, WP SHOWS NOTICES AFTER FIRST Hx TAG-->
    <h2 class="nav-tab-wrapper">
        <?php echo $tabsHtml ?>
    </h2>
    <?php
    // @codingStandardsIgnoreLine
    echo $content;
    ?>
</div>
