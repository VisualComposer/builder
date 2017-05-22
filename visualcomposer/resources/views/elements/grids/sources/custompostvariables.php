<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
window.vcvPostsGridSourcePostTypes = <?php echo json_encode(vchelper('PostType')->getPostTypes(['post', 'page'])); ?>;
