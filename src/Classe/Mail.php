<?php

namespace App\Classe;

use Mailjet\Client;
use Mailjet\Resources;

Class Mail
{
    private $api_key = 'f08ae1615d74361792051e28524c48ed';
    private $api_key_secret = '419bf99263e5cccefdebc69661b1e740';

    public function send($to_email, $to_name, $subject, $content)
    {
        $mj = new Client($this->api_key, $this->api_key_secret, true, ['version' => 'v3.1']);
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "contact@discommentondit.fr",
                        'Name' => "SYMREACT"
                    ],
                    'To' => [
                        [
                            'Email' => $to_email,
                            'Name' => $to_name
                        ]
                    ],
                    'TemplateID' => 3677200,
                    'TemplateLanguage' => true,
                    'Subject' => $subject,
                    'Variables' => [
                        'content' => $content
                    ]
                ]
            ]
        ];
        $response = $mj->post(Resources::$Email, ['body' => $body]);
        $response->success();
    }
}