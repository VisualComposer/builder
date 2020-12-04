<?php

namespace VisualComposer\Modules\Editors\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Elements;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addFilter('vcv:ajax:editors:elements:delete:adminNonce', 'softDelete');
    }

    protected function softDelete(Request $requestHelper, Elements $elementsHelper)
    {
        $elementToRemove = esc_sql($requestHelper->input('vcv-element-tag'));
        // don't allow for default elements
        if (in_array($elementToRemove, $elementsHelper->getDefaultElements(), true)) {
            return ['status' => false, 'message' => __('The default element cannot be removed', 'visualcomposer')];
        }

        if ($this->isElementUsed($elementToRemove)) {
            return [
                'status' => false,
                'message' => __(
                    'The element is in use on one of your pages or templates. Remove all element copies from your site before deleting it.',
                    'visualcomposer'
                ),
            ];
        }

        // Soft delete element
        $optionHelper = vchelper('Options');
        $dbElements = $optionHelper->get('hubElements', []);
        if (is_array($dbElements) && isset($dbElements[ $elementToRemove ])) {
            $dbElements[ $elementToRemove ]['metaIsElementRemoved'] = true;
            $optionHelper->set('hubElements', $dbElements);
            $optionHelper->delete('hubAction:element/' . $elementToRemove);
        }

        return ['status' => true];
    }

    /**
     * @param $elementToRemove
     *
     * @return bool
     */
    protected function isElementUsed($elementToRemove)
    {
        // Find
        // 1. check is element used
        /** @see \VisualComposer\Modules\Hub\Actions\PostUpdateAction::getUpdateablePosts */
        $vcvPosts = new \WP_Query(
            [
                'post_type' => get_post_types(['public' => true], 'names'),
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft'],
                'posts_per_page' => 1, // we just need one page
                'meta_key' => VCV_PREFIX . 'pageContent',
                'meta_value' => rawurlencode('"tag":"' . $elementToRemove . '"'),
                'meta_compare' => 'LIKE',
                'suppress_filters' => true,
            ]
        );

        // @codingStandardsIgnoreLine
        return $vcvPosts->found_posts > 0;
    }
}
