<?php

class AjaxControllerTest extends WP_UnitTestCase
{
    public function testGetResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');

        $filterHelper->listen(
            'vcv:ajax:testGetResponse',
            function ($response) {
                return 'my custom response';
            }
        );

        $this->assertEquals('my custom response', $module->call('getResponse', ['testGetResponse']));
    }

    public function testParseResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');

        $this->assertEquals(
            '{"status":"custom"}',
            $module->call(
                'renderResponse',
                [
                    'response' => ['status' => 'custom'],
                ]
            )
        );
    }

    public function testParseCyrilicResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');

        $this->assertEquals(
            '{"status":"\u0442\u0435\u0441\u0442\u043e\u0432\u044b\u0439 \u0442\u0435\u043a\u0441\u0442, \u0442\u0435\u0441\u0442! l\u00f6sen \u6211\u5df2\u7ecf\u5c1d\u8bd5\u4e86\u5f88\u591a\u51fd\u6570"}',
            $module->call(
                'renderResponse',
                [
                    'response' => ['status' => 'тестовый текст, тест! lösen 我已经尝试了很多函数'],
                ]
            )
        );
    }

    public function testHtmlResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        function utf8ize($mixed)
        {
            if (is_array($mixed)) {
                foreach ($mixed as $key => $value) {
                    $mixed[ $key ] = utf8ize($value);
                }
            } else if (is_string($mixed)) {
                return utf8_encode($mixed);
            }

            return $mixed;
        }

        $html = <<<HTML
<div class="relevant"><p>相关文章</p><ul class="relative_list"><li><a href="" target="_blank" title="如何在android中解决此错误“com.android.internal.telephony无法解析为类型”">如何在android中解决此错误“com.android.internal.telephony无法解析为类型”</a></li><li><a href="" target="_blank" title="java  - 如何解决此错误VFY：无法解析虚方法">java  - 如何解决此错误VFY：无法解析虚方法</a></li><li><a href="" target="_blank" title="c++  如何解决错误LNK2019：未解析的外部符号 - 函数？">c++  如何解决错误LNK2019：未解析的外部符号 - 函数？</a></li><li><a href="" target="_blank" title="php  - 如何在mysql查询中解决“不在GROUP BY中”错误">php  - 如何在mysql查询中解决“不在GROUP BY中”错误</a></li><li><a href="" target="_blank" title="如何在PHP中解决“无法通过引用传递参数”错误？">如何在PHP中解决“无法通过引用传递参数”错误？</a></li><li><a href="" target="_blank" title="php  - 如何在Windows中解决“调用未定义函数dbase_open()”错误">php  - 如何在Windows中解决“调用未定义函数dbase_open()”错误</a></li><li><a href="" target="_blank" title="使用json_decode在PHP中解析JSON对象">使用json_decode在PHP中解析JSON对象</a></li><li><a href="" target="_blank" title="如何在curl php中解决HTTP / 1.1 400错误请求">如何在curl php中解决HTTP / 1.1 400错误请求</a></li></ul></div>
HTML;

        $this->assertEquals(
            '{"status":"<div class=\"relevant\"><p>\u76f8\u5173\u6587\u7ae0<\/p><ul class=\"relative_list\"><li><a href=\"\" target=\"_blank\" title=\"\u5982\u4f55\u5728android\u4e2d\u89e3\u51b3\u6b64\u9519\u8bef\u201ccom.android.internal.telephony\u65e0\u6cd5\u89e3\u6790\u4e3a\u7c7b\u578b\u201d\">\u5982\u4f55\u5728android\u4e2d\u89e3\u51b3\u6b64\u9519\u8bef\u201ccom.android.internal.telephony\u65e0\u6cd5\u89e3\u6790\u4e3a\u7c7b\u578b\u201d<\/a><\/li><li><a href=\"\" target=\"_blank\" title=\"java  - \u5982\u4f55\u89e3\u51b3\u6b64\u9519\u8befVFY\uff1a\u65e0\u6cd5\u89e3\u6790\u865a\u65b9\u6cd5\">java  - \u5982\u4f55\u89e3\u51b3\u6b64\u9519\u8befVFY\uff1a\u65e0\u6cd5\u89e3\u6790\u865a\u65b9\u6cd5<\/a><\/li><li><a href=\"\" target=\"_blank\" title=\"c++  \u5982\u4f55\u89e3\u51b3\u9519\u8befLNK2019\uff1a\u672a\u89e3\u6790\u7684\u5916\u90e8\u7b26\u53f7 - \u51fd\u6570\uff1f\">c++  \u5982\u4f55\u89e3\u51b3\u9519\u8befLNK2019\uff1a\u672a\u89e3\u6790\u7684\u5916\u90e8\u7b26\u53f7 - \u51fd\u6570\uff1f<\/a><\/li><li><a href=\"\" target=\"_blank\" title=\"php  - \u5982\u4f55\u5728mysql\u67e5\u8be2\u4e2d\u89e3\u51b3\u201c\u4e0d\u5728GROUP BY\u4e2d\u201d\u9519\u8bef\">php  - \u5982\u4f55\u5728mysql\u67e5\u8be2\u4e2d\u89e3\u51b3\u201c\u4e0d\u5728GROUP BY\u4e2d\u201d\u9519\u8bef<\/a><\/li><li><a href=\"\" target=\"_blank\" title=\"\u5982\u4f55\u5728PHP\u4e2d\u89e3\u51b3\u201c\u65e0\u6cd5\u901a\u8fc7\u5f15\u7528\u4f20\u9012\u53c2\u6570\u201d\u9519\u8bef\uff1f\">\u5982\u4f55\u5728PHP\u4e2d\u89e3\u51b3\u201c\u65e0\u6cd5\u901a\u8fc7\u5f15\u7528\u4f20\u9012\u53c2\u6570\u201d\u9519\u8bef\uff1f<\/a><\/li><li><a href=\"\" target=\"_blank\" title=\"php  - \u5982\u4f55\u5728Windows\u4e2d\u89e3\u51b3\u201c\u8c03\u7528\u672a\u5b9a\u4e49\u51fd\u6570dbase_open()\u201d\u9519\u8bef\">php  - \u5982\u4f55\u5728Windows\u4e2d\u89e3\u51b3\u201c\u8c03\u7528\u672a\u5b9a\u4e49\u51fd\u6570dbase_open()\u201d\u9519\u8bef<\/a><\/li><li><a href=\"\" target=\"_blank\" title=\"\u4f7f\u7528json_decode\u5728PHP\u4e2d\u89e3\u6790JSON\u5bf9\u8c61\">\u4f7f\u7528json_decode\u5728PHP\u4e2d\u89e3\u6790JSON\u5bf9\u8c61<\/a><\/li><li><a href=\"\" target=\"_blank\" title=\"\u5982\u4f55\u5728curl php\u4e2d\u89e3\u51b3HTTP \/ 1.1 400\u9519\u8bef\u8bf7\u6c42\">\u5982\u4f55\u5728curl php\u4e2d\u89e3\u51b3HTTP \/ 1.1 400\u9519\u8bef\u8bf7\u6c42<\/a><\/li><\/ul><\/div>"}',
            $module->call(
                'renderResponse',
                [
                    'response' => [
                        'status' => $html,
                    ],
                ]
            )
        );
        $this->assertEquals(
            $html,
            json_decode(
                $module->call(
                    'renderResponse',
                    [
                        'response' => [
                            'status' => $html,
                        ],
                    ]
                ),
                true
            )['status']
        );
    }

    public function testValidateNonce()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        /** @var \VisualComposer\Helpers\Nonce $nonceHelper */
        $nonceHelper = vchelper('Nonce');
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:nonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => $nonceHelper->user()]);
        $this->assertTrue(
            $module->call(
                'validateNonce',
                [
                    'test:nonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => 'someInvalidNonce11']);
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:nonce',
                    $requestHelper,
                ]
            )
        );
        $requestHelper->setData([]);
    }

    public function testValidateNonceAdmin()
    {
        wp_set_current_user(1);
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        /** @var \VisualComposer\Helpers\Nonce $nonceHelper */
        $nonceHelper = vchelper('Nonce');
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:adminNonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => $nonceHelper->admin()]);
        $this->assertTrue(
            $module->call(
                'validateNonce',
                [
                    'test:adminNonce',
                    $requestHelper,
                ]
            )
        );

        $requestHelper->setData(['vcv-nonce' => 'someInvalidNonce']);
        $this->assertFalse(
            $module->call(
                'validateNonce',
                [
                    'test:adminNonce',
                    $requestHelper,
                ]
            )
        );
        $requestHelper->setData([]);
    }

    public function testValidateEmpty()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        $this->assertTrue(
            $module->call(
                'validateNonce',
                [
                    'test',
                ]
            )
        );
    }

    public function testRenderResponse()
    {
        /** @var \VisualComposer\Modules\System\Ajax\Controller $module */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');

        $this->assertTrue(is_string($module->call('renderResponse', ['test'])));
        $this->assertTrue(is_string($module->call('renderResponse', [''])));
        $this->assertEquals('test', $module->call('renderResponse', ['test']));

        $this->assertEquals('1', $module->call('renderResponse', [1]));
        $this->assertEquals('["test"]', ($module->call('renderResponse', [['test']])));
        $this->assertEquals('{"test":0}', ($module->call('renderResponse', [['test' => 0]])));
        $this->assertEquals('{"test":true}', ($module->call('renderResponse', [['test' => true]])));
        $this->assertEquals('{"test":false}', ($module->call('renderResponse', [['test' => false]])));
        $this->assertEquals('{"test":1}', ($module->call('renderResponse', [['test' => 1]])));
        $this->assertEquals('{"test":"hi"}', ($module->call('renderResponse', [['test' => 'hi']])));

    }

    public function testSetGlobals()
    {
        $this->assertFalse(defined('VCV_AJAX_REQUEST_CALL'));
        $this->assertFalse(defined('DOING_AJAX'));

        /** @var \VisualComposer\Modules\System\Ajax\Controller $controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\System\Ajax\Controller');
        $module->call('setGlobals');

        $this->assertTrue(defined('VCV_AJAX_REQUEST_CALL'));
        $this->assertTrue(defined('DOING_AJAX'));
        $this->assertTrue(VCV_AJAX_REQUEST_CALL);
        $this->assertTrue(DOING_AJAX);
    }
}
