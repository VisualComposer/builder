<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Get Active Tab
$activeTab = '';
if (isset($_GET['page'])) {
    $activeTab = esc_attr($_GET['page']);
}

$tabsHelper = vchelper('SettingsTabsRegistry');
$allTabs = $tabsHelper->getHierarchy();
$activeTabData = $tabsHelper->get($activeTab);

// Get Parent Tab
$parentSlug = $activeTabData['parent'] === false ? $activeTab : $activeTabData['parent'];
$parentTab = $tabsHelper->get($parentSlug);
$pageTitle = $parentSlug === false ? $activeTabData['name'] : $parentTab['name'];

// Make hub first item
$hubArray = [
    'vcv-hub' => $allTabs['vcv-hub'],
];
unset($allTabs['vcv-hub']);
$allTabs = array_merge($hubArray, $allTabs);

// Get Variables
$variables = vcfilter(
    'vcv:wp:dashboard:variables',
    [
        [
            'key' => 'VCV_SLUG',
            'value' => $parentSlug,
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
<style>
    #wpwrap,
    #wpcontent,
    #wpbody,
    #wpbody-content,
    .vcv-settings {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        flex: 1 0 auto;
    }

    #adminmenumain {
        height: 0;
    }

    #wpcontent {
        padding: 0;
        position: relative;
    }

    #wpbody {
        position: static;
    }

    #wpbody-content {
        padding: 0;
    }

    .auto-fold #wpcontent {
        padding: 0;
    }

    #wpfooter {
        z-index: -1;
    }

    .notice {
        display: none;
    }
</style>
<div class="wrap vcv-settings">
    <section class="vcv-dashboard-container">
        <aside class="vcv-dashboard-sidebar">
            <header class="vcv-dashboard-sidebar-header">
                <a class="vcv-dashboard-logo" href="https://visualcomposer.com/" rel="noopener" target="_blank">
                    <?php evcview('settings/partials/dashboard-logo'); ?>
                </a>
                <button class="vcv-dashboard-nav-toggle" aria-label="Navigation toggle" aria-expanded="false">
                    <span class="vcv-dashboard-nav-toggle-hamburger"></span>
                </button>
            </header>
            <div class="vcv-dashboard-sidebar-navigation-container">
                <nav class="vcv-dashboard-sidebar-navigation vcv-dashboard-sidebar-navigation--main">
                    <ul class="vcv-dashboard-sidebar-navigation-menu">
                        <?php
                        foreach ($allTabs as $menuKey => $menuValue) :
                            $activeClass = $menuKey === $parentSlug ? ' vcv-dashboard-sidebar-navigation-link--active' : '';
                            ?>
                            <li class="vcv-dashboard-sidebar-navigation-menu-item">
                                <a class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard
                                <?php echo esc_attr($menuValue['iconClass']) .  esc_attr($activeClass) ?>"
                                href="?page=<?php echo esc_attr($menuKey)?>">
                                    <?php echo esc_html__($menuValue['name'], 'visualcomposer') ?>
                                </a>
                                <?php
                                // Render sub menu items
                                if (isset($menuValue['children'])) :
                                    $subTabs = $menuValue['children'];
                                    ?>
                                    <ul class="vcv-dashboard-sidebar-navigation-menu vcv-dashboard-sidebar-navigation-menu--submenu">
                                        <?php
                                        foreach ($subTabs as $tabKey => $tab) :
                                            $activeClass = $tabKey === $activeTab ? ' vcv-dashboard-sidebar-navigation-link--active' : '';
                                            $tabTitle = empty($tab['subTitle']) ? $tab['name'] : $tab['subTitle'];
                                            $subMenuLink = $menuKey === $parentSlug ? 'javascript:void(0)' : '?page=' . esc_attr($tabKey);
                                            ?>
                                            <li class="vcv-dashboard-sidebar-navigation-menu-item">
                                                <a class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard <?php echo esc_attr($activeClass) ?>"
                                                   href="<?php echo $subMenuLink ?>"
                                                   data-value="<?php echo esc_attr($tabKey) ?>">
                                                    <?php echo esc_html__($tabTitle, 'visualcomposer'); ?>
                                                </a>
                                            </li>
                                        <?php endforeach;?>
                                    </ul>
                                <?php endif; ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </nav>
                <nav class="vcv-dashboard-sidebar-navigation vcv-dashboard-sidebar-navigation--bottom">
                    <ul class="vcv-dashboard-sidebar-navigation-menu">
                        <li class="vcv-dashboard-sidebar-navigation-menu-item">
                            <?php
                            echo sprintf(
                                '<a href="%s" class="vcv-dashboard-sidebar-navigation-link vcv-ui-icon-dashboard vcv-ui-icon-dashboard-star">%s</a>',
                                esc_url(admin_url('admin.php?page=vcv-go-premium&vcv-ref=plugins-page')),
                                __('Go Premium', 'visualcomposer')
                            );
                            ?>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
        <main class="vcv-dashboard-main">
            <div>
                <?php if ($pageTitle && !$activeTabData['hideTitle']) {
                    echo '<h1>' . $pageTitle . '</h1>';
                }
                if (isset($allTabs[ $parentSlug ]['children'])) {
                    $renderedTabs = $allTabs[ $parentSlug ]['children'];
                    foreach ($renderedTabs as $tabKey => $tab) {
                        $tab['callback']();
                    }
                } else {
                    $activeTabData['callback']();
                }
                ?>
            </div>
        </main>
    </section>
</div>
