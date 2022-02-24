<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ForgetRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\CheckTokenController;
use App\Controller\PutTokenController;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ForgetRepository::class)
 */
#[ApiResource(
    normalizationContext: ['groups' => ['forgets_read']],
    denormalizationContext: ["disable_type_enforcement" => true],
    itemOperations: [
        'get',
        'delete',
        'put',
        'post_token' => [
            'method' => 'POST',
            'path' => '/forgets/{id}/post_token',
            'requirements' => ['id' => '\d+'],
            'controller' => PutTokenController::class,             
            'read'=> false,
            'pagination_enabled'=> false,
            'openapi_context' => [
                'summary' => 'Enregistre le token',
                'description' => 'Enregistre en base la demande de reset_password avec user, token, createdAt'
            ]
        ],
        'get_token' => [
            'method' => 'GET',
            'path' => '/forgets/{id}/get_token',
            'controller' => CheckTokenController::class,             
            'read'=> false,
            'pagination_enabled'=> false,
            'openapi_context' => [
                'summary' => 'Vérifie le token',
                'description' => 'Vérifie si le token existe et si la date est inférieure à 3 heures'
            ]
        ]
    ]
)]
class Forget
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(["forgets_read"])]
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     */
    #[Groups(["forgets_read"])]
    private $user;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(["forgets_read"])]
    private $token;

    /**
     * @ORM\Column(type="datetime")
     */
    #[Groups(["forgets_read"])]
    private $createdAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
