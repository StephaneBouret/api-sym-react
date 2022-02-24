<?php

namespace App\Controller;

use App\Classe\Mail;
use App\Entity\User;
use App\Entity\Forget;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class PutTokenController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function __invoke($id, Forget $data, Request $request)
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['id' => $id]);
        $data->setUser($user);
        $data->setToken(bin2hex(random_bytes(100)));
        $data->setCreatedAt(new \DateTime());
        $this->em->persist($data);
        $this->em->flush();

        $hostname = $request->getSchemeAndHttpHost();
        $link = $hostname ."/#/resetpassword/".$data->getToken();

        $content = "Bonjour " .$user->getFirstname(). "<br/>Vous avez demandé à réinitialiser votre mot de passe sur l'application SymReact.<br/><br/>";
        $content .= "Merci de bien vouloir cliquer sur le lien suivant pour <a href='" . $link . "'>mettre à jour votre mot de passe</a>.";

        $mail = new Mail;
        $mail->send($user->getEmail(), $user->getFirstname() . ' ' . $user->getLastname(), 'Réinitialiser votre mot de passe sur l\'application SymReact', $content);

        return $data;
    }
}