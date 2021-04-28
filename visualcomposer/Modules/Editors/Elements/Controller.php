<?php

namespace VisualComposer\Modules\Editors\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Hub\Elements;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Elements\Controller::softDelete */
        $this->addFilter('vcv:ajax:editors:elements:delete:adminNonce', 'softDelete');
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Hub\Elements $elementsHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @return array|bool[]
     * @throws \Exception
     */
    protected function softDelete(
        Request $requestHelper,
        Elements $elementsHelper,
        CurrentUser $currentUserAccess
    ) {
        $hasAccess = $currentUserAccess->wpAll('manage_options')->get();
        if (vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
            $hasAccess = $currentUserAccess->part('hub')->can('elements_templates_blocks')->get();
        }
        if (!$hasAccess) {
            return [
                'status' => false,
                'message' => __(
                    'You are not allowed to delete elements.',
                    'visualcomposer'
                ),
            ];
        }
        $elementToRemove = esc_sql($requestHelper->input('vcv-element-tag'));
        // don't allow for default elements
        if (in_array($elementToRemove, $elementsHelper->getDefaultElements(), true)) {
            return ['status' => false, 'message' => __('The default element cannot be removed', 'visualcomposer')];
        }

        if ($elementsHelper->isElementUsed($elementToRemove)) {
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
}
