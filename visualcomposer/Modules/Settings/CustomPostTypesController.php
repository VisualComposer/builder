<?php

namespace VisualComposer\Modules\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class CustomPostTypesController.
 */
class CustomPostTypesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction(
            'admin_init',
            function (Request $requestHelper) {
                $postType = $requestHelper->input('post_type', '');
                if (strpos($postType, 'vcv_') !== false) {
                    if (!vcvenv('VCV_DASHBOARD_IFRAME_' . strtoupper($postType))) {
                        return;
                    }
                    remove_all_actions('admin_notices');
                    echo <<<STYLE
<style>
#adminmenumain, #wpadminbar {
    display: none !important;
}
#wpcontent, #wpfooter {
    margin-left: 0 !important;
}
#wpfooter {
    display: none !important;
}
html, #wpcontent, #wpbody, #wpbody-content {
    padding: 0 !important;
}
.wrap, #screen-meta, #screen-meta-links {
    margin: 0 !important;
}
.wrap {
    margin-top: 50px !important;
}
.wp-heading-inline {
    padding-top: 0 !important;
}
</style>
<script>
(function() {
  var handler = function() {
      // This page used in iframe - on click we should modify iframe parent window
      var linksToParent = ['a.row-title', '.vcv-edit-with-vcwb', '.page-title-action']
      linksToParent.forEach(function(item) {
        document.querySelectorAll(item).forEach(function(node) {
          node.target = '_parent'
        })
      })
  }
  document.addEventListener('DOMContentLoaded', handler)
})()
</script>
STYLE;
                }
            }
        );
    }
}
