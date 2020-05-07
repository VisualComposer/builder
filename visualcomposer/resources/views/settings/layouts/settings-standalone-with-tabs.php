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
    $tabsHtml .= '<a href="?page=' . esc_attr($tabKey) . '" class="nav-tab' . esc_attr($activeClass) . '">'
        . esc_html__($tab['name'], 'visualcomposer') . '</a>';
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
    <!-- TODO remove style attribute to see dashboard in WP. Uncomment code in  -->
    <section class="vcv-dashboard-container" style="display: none">
        <aside class="vcv-dashboard-sidebar">
            <header class="vcv-dashboard-sidebar-header">
                <a class="vcv-dashboard-logo" href="https://visualcomposer.com/" rel="home">
                    <img class="vcv-dashboard-logo-img" width="324" height="33" src="https://my.visualcomposer.com/wp-content/uploads/2019/11/VC_logo.png" alt="Visual Composer" srcset="https://my.visualcomposer.com/wp-content/uploads/2019/11/VC_logo.png 324w, https://my.visualcomposer.com/wp-content/uploads/2019/11/VC_logo-300x31.png 300w" sizes="(max-width: 324px) 100vw, 324px">
                    <!--Set path to public/sources/images/brandLogo/vcwb-switch-logo.png-->
                    <!--<img class="vcv-dashboard-logo-img" width="324" height="33" src="../../../../public/sources/images/brandLogo/vcwb-switch-logo.png" alt="Visual Composer">-->
                </a>
                <button class="vcv-dashboard-nav-toggle" aria-label="Close Dashboard Navigation" aria-expanded="false">
                    <span class="vcv-dashboard-nav-toggle-hamburger"></span>
                </button>
            </header>
            <div class="vcv-dashboard-sidebar-navigation-container">
                <nav class="vcv-dashboard-sidebar-navigation vcv-dashboard-sidebar-navigation--main">
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-dashboard-sidebar-navigation-item--active vcv-ui-icon-dashboard vcv-ui-icon-dashboard-hub-shop" href="#">Visual Composer Hub</a>
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-ui-icon-dashboard vcv-ui-icon-dashboard-settings" href="#">Settings</a>
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-ui-icon-dashboard vcv-ui-icon-dashboard-css" href="#">CSS, HTML & JavaScript</a>
                </nav>
                <nav class="vcv-dashboard-sidebar-navigation vcv-dashboard-sidebar-navigation--bottom">
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-ui-icon-dashboard vcv-ui-icon-dashboard-star" href="#">Go Premium</a>
                </nav>
            </div>
        </aside>
        <main class="vcv-dashboard-main">
            <!-- This is the placeholder content -->
            <div>
                <h1>Settings</h1>
                <div class="vcv-dashboard-tabs">
                    <a class="vcv-dashboard-tab" href="#">General</a>
                    <a class="vcv-dashboard-tab vcv-dashboard-tab--active" href="#">Headers and Footers</a>
                    <a class="vcv-dashboard-tab" href="#">Maintenance Mode</a>
                    <a class="vcv-dashboard-tab" href="#">Popup Settings</a>
                </div>
                <div class="vcv-dashboard-dropdown">
                    <select class="vcv-dashboard-dropdown-select" name="" id="">
                        <option value="general">General</option>
                        <option value="hfs">Headers and Footers</option>
                        <option value="maintenance">Maintenance Mode</option>
                        <option value="popup">Popup Settings</option>
                    </select>
                </div>
                <h2>Gutenberg Editor</h2>
                <p class="description">Specify post types where you want to use Visual Composer Website Builder. Specify post types where you want to use Visual Composer Website Builder. Specify post types where you want to use Visual Composer Website Builder.</p>
                <table class="form-table">
                    <tbody>
                    <tr>
                        <th scope="row">Post</th>
                        <td>
                            <div class="vcv-ui-form-switch-container">
                                <label class="vcv-ui-form-switch">
                                    <input type="checkbox" value="post" name="vcv-post-types[]" checked="checked">
                                    <span class="vcv-ui-form-switch-indicator"></span>
                                    <span class="vcv-ui-form-switch-label" data-vc-switch-on="on"></span>
                                    <span class="vcv-ui-form-switch-label" data-vc-switch-off="off"></span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Page</th>
                        <td>
                            <div class="vcv-ui-form-switch-container">
                                <label class="vcv-ui-form-switch">
                                    <input type="checkbox" value="page" name="vcv-post-types[]" checked="checked">
                                    <span class="vcv-ui-form-switch-indicator"></span>
                                    <span class="vcv-ui-form-switch-label" data-vc-switch-on="on"></span>
                                    <span class="vcv-ui-form-switch-label" data-vc-switch-off="off"></span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Product</th>
                        <td>
                            <div class="vcv-ui-form-switch-container">
                                <label class="vcv-ui-form-switch">
                                    <input type="checkbox" value="product" name="vcv-post-types[]">
                                    <span class="vcv-ui-form-switch-indicator"></span>
                                    <span class="vcv-ui-form-switch-label" data-vc-switch-on="on"></span>
                                    <span class="vcv-ui-form-switch-label" data-vc-switch-off="off"></span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button class="vcv-dashboard-button vcv-dashboard-button--save">Save Changes</button>
            </div>
        </main>
    </section>
    <script>
      const dashboardNavigationToggle = document.querySelector('.vcv-dashboard-nav-toggle')
      const dashboardNavigationMenu = document.querySelector('.vcv-dashboard-sidebar-navigation-container')

      const handleNavigationToggle = () => {
        dashboardNavigationMenu.classList.toggle('vcv-is-navigation-visible')
        const ariaExpandedAttr = dashboardNavigationToggle.getAttribute('aria-expanded')
        const newAriaExpandedAttr = ariaExpandedAttr === 'true' ? 'false' : 'true'
        dashboardNavigationToggle.setAttribute('aria-expanded', newAriaExpandedAttr)
      }

      dashboardNavigationToggle.addEventListener('click', handleNavigationToggle)
    </script>
    <h1></h1> <!--DONT REMOVE, WP SHOWS NOTICES AFTER FIRST Hx TAG-->
    <h2 class="nav-tab-wrapper">
        <?php echo $tabsHtml ?>
    </h2>
    <?php
    // @codingStandardsIgnoreLine
    echo $content;
    ?>
</div>
