<?php

namespace VisualComposer\Modules\Account;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Account\Pages\ActivationFinishPage;

/**
 * Class ActivationTokenController
 * @package VisualComposer\Modules\Account
 */
class ActivationTokenController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * ActivationTokenController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Account\ActivationTokenController::registerToken */
        $this->wpAddAction(
            'admin_init',
            'registerToken'
        );

        /** @see \VisualComposer\Modules\Account\ActivationTokenController::hookApiRequest */
        $this->addFilter(
            'vcv:ajax:account:token:api',
            'hookApiRequest'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Token $tokenHelper
     */
    private function registerToken(Token $tokenHelper)
    {
        // $tokenHelper->reset();
        if (!$tokenHelper->isSiteRegistered()) {
            $tokenHelper->createSecret();
        }
    }

    private function hookApiRequest(
        Request $requestHelper,
        Token $tokenHelper,
        ActivationFinishPage $activationFinishPage
    ) {
        if ($requestHelper->exists('code')) {
            // post to the API to get token
            /** @see \VisualComposer\Helpers\Token::generateToken */
            $code = $requestHelper->input('code');
            $token = $tokenHelper->createToken($code);
            if ($token) {
                wp_redirect(self_admin_url('admin.php?page=' . $activationFinishPage->getSlug()));
                die;
            }
        }
        wp_redirect(self_admin_url('admin.php?page=' . $activationFinishPage->getSlug() . '&failed=true'));
        die;
    }
}
