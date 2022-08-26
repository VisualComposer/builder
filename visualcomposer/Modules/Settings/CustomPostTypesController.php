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
                    $this->wpAddAction(
                        'admin_footer',
                        function () {
                            $js = <<<JS
<script>
(function() {
  let handler = function() {
      // This page used in iframe - on click we should modify iframe parent window
      let linksToParent = ['a']
      linksToParent.forEach(function(item) {
        document.querySelectorAll(item).forEach(function(node) {
          if (node.href.indexOf('action=edit') !== -1 || node.href.indexOf('post-new.php') !== -1) {
            // if not row-action parent then reload parent page
            node.target = '_parent'
          }
        })
      })
  }
  document.addEventListener('DOMContentLoaded', handler)
})();
</script>
JS;
                            $outputHelper = vchelper('Output');
                            $outputHelper->printNotEscaped($js);
                        }
                    );
                }
            }
        );
    }
}
