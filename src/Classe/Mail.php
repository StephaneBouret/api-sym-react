<?php

namespace App\Classe;

use Mailjet\Client;
use Mailjet\Resources;

Class Mail
{
    private $api_key = '52f99b29258b7c58db3fd8b01b30abfd';
    private $api_key_secret = '7c02f4a462e446c10ba604636dd4e272';

    public function send($to_email, $to_name, $subject, $content)
    {
        $mj = new Client($this->api_key, $this->api_key_secret, true, ['version' => 'v3.1']);
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "contact@discommentondit.com",
                        'Name' => "Dis, comment on dit ?"
                    ],
                    'To' => [
                        [
                            'Email' => $to_email,
                            'Name' => $to_name
                        ]
                    ],
                    'TemplateID' => 3375265,
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