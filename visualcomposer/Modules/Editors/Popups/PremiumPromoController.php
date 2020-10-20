<?php

namespace VisualComposer\Modules\Editors\Popups;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Popups;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PremiumPromoController
 * @package VisualComposer\Modules\Editors\Popups
 */
class PremiumPromoController extends Container implements Module
{
    use EventsFilters;

    /**
     * PremiumPromoController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addVariables');
        $this->addFilter('vcv:ajax:premiumPromoPopup:submit:adminNonce', 'submitPopupClose');
    }

    protected function submitPopupClose($response, $payload, Options $optionsHelper)
    {
        $optionsHelper->set('premium-promo-popup-closed', time());
    }

    /**
     * @param $variables
     * @param $payload
     * @param \VisualComposer\Helpers\Popups $popupsHelper
     *
     * @return array
     */
    protected function addVariables($variables, $payload, Popups $popupsHelper)
    {
        $variables[] = [
            'key' => 'VCV_SHOW_PREMIUM_PROMO_POPUP',
            'value' => $popupsHelper->showPremiumPromoPopup(),
            'type' => 'constant',
        ];

        return $variables;
    }
}
