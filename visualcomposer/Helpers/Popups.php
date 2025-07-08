<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Popups.
 */
class Popups implements Helper
{
    protected static $showPremiumPromoPopupCache;

    public function showPremiumPromoPopup()
    {
        if (!is_null(self::$showPremiumPromoPopupCache)) {
            return self::$showPremiumPromoPopupCache;
        }

        $result = false;
        $optionsHelper = vchelper('Options');
        $licenseHelper = vchelper('License');
        // Only if Free license activated and popup never shown before (never closed actually)
        if ($licenseHelper->isPremiumActivated() || !empty($optionsHelper->get('premium-promo-popup-closed'))) {
            self::$showPremiumPromoPopupCache = $result;
            return self::$showPremiumPromoPopupCache;
        }

        // Only if false (so it is not yet shown or already sent)
        $user = wp_get_current_user();
        if (!empty($user->ID)) {
            $feedbackTime = get_user_meta($user->ID, 'vcv-feedback-score-time', true);
            if (!empty($feedbackTime)) {
                // Check 3 days delay
                $result = (time() - 3 * DAY_IN_SECONDS) < (int)$feedbackTime;
            } else {
                // Not sent yet, and not shown yet (feedback)
                $result = true;
            }
        }

        if ($result) {
            // Show only if current license-type (free) used for at least 14 days
            $result = vchelper('Plugin')->isActivelyUsed(14);
        }
        self::$showPremiumPromoPopupCache = $result;

        return vcfilter('vcv:helpers:popups:showPremiumPromoPopup', self::$showPremiumPromoPopupCache);
    }
}
