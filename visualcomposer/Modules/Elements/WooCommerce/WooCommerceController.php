<?php
namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceController extends Container
{
    use EventsFilters;
    use ShortcodesTrait;

    private $shortcodeNs = 'woocommerce:';

    private $shortcodeTag = '';

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see ShortcodesTrait::renderEditor */
        $this->addFilter(
            'vcv:ajax:elements:' . $this->shortcodeNs . $this->shortcodeTag . ':adminNonce',
            'renderEditor'
        );
    }
}
