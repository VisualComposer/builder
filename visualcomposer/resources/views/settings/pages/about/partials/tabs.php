<?php

if (!defined('ABSPATH')) {
    die('-1');
}

$urlFunction = is_network_admin() ? 'network_admin_url' : 'admin_url';

?>
<h2 class="nav-tab-wrapper">
    <?php foreach ($tabs as $tab) : ?>
        <?php

        $page = 'admin.php?page=' . rawurlencode($slug) . '&tab=' . rawurlencode($tab['slug']);

        $url = call_user_func($urlFunction, $page);

        $class = 'nav-tab';

        if ($tab['slug'] === $activeTabSlug) {
            $class .= ' ' . (' nav-tab-active');
        }

        ?>
        <a href="<?php echo esc_attr($url) ?>" class="<?php echo esc_attr($class) ?>">
            <?php echo $tab['title'] ?>
        </a>
        <?php
    endforeach ?>
</h2>