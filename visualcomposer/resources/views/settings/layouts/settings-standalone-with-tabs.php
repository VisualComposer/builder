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

$tabsHelper = vchelper('Tabs');
$tabs = $tabsHelper->getTabs();

$tabsHtml = '';

foreach ($tabs as $tabKey => $tab) {
    $activeClass = $tabKey === $activeTab ? ' nav-tab-active' : '';
    $tabsHtml .= '<a href="?page=' . esc_attr($tabKey) . '" class="nav-tab' . esc_attr($activeClass) . '">' . esc_html__($tab['name'], 'vcwb') . '</a>';
}

evcview('settings/partials/admin-nonce');
?>
<script>
  window.vcvAjaxUrl = '<?php echo vchelper('Url')->ajax(); ?>';
  window.vcvAdminAjaxUrl = '<?php echo vchelper('Url')->adminAjax(); ?>';
</script>
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
