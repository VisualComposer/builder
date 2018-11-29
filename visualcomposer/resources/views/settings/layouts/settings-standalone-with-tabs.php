<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$activeTab = '';

if (isset($_GET['page'])) {
    $activeTab = $_GET['page'];
}

$tabs = [
    'vcv-settings' => ['name' => 'General'],
    'vcv-system-status' => ['name' => 'System status'],
];

$tabsHtml = '';

foreach ($tabs as $tabKey => $tab) {
    $activeClass = $tabKey === $activeTab ? ' nav-tab-active' : '';
    $tabsHtml .= '<a href="?page='.$tabKey.'" class="nav-tab'.$activeClass.'">'.esc_html__($tab['name'], 'vcwb').'</a>';
}

evcview('settings/partials/admin-nonce');
?>
<div class="wrap vcv-settings">
    <h1 /> <!--DONT REMOVE, WP SHOWS NOTICES AFTER FIRST Hx TAG-->
    <h2 class="nav-tab-wrapper">
        <?php echo $tabsHtml ?>
    </h2>
    <?php
    // @codingStandardsIgnoreLine
    echo $content;
    ?>
</div>
