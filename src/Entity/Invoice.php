<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Controller\InvoiceIncrementationController;
use DateTimeInterface;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 */
#[ApiResource(
    subresourceOperations: [
        'api_customers_invoices_get_subresource' => [
            'normalization_context' => [
                'groups' => ['invoices_subresource'],
            ],
        ]
    ],
    denormalizationContext: ["disable_type_enforcement" => true],
    itemOperations: [
        'get',
        'put',
        'delete',
        'increment' => [
            'method' => 'POST',
            'path' => '/invoices/{id}/increment',
            'controller' => InvoiceIncrementationController::class,
            'openapi_context' => [
                'summary' => 'Incrémente une facture',
                'description' => "Incrémente le chrono d'une facture donnée"
            ]
        ],
    ],
    attributes: [
    "pagination_enabled" => true,
    "pagination_items_per_page" => 20,
    'normalization_context' => ['groups' => ['invoices_read']],
    ],
    order: ["sentAt" => "DESC"]
)]
#[ApiFilter(OrderFilter::class, properties: ['amount', 'sentAt'])]
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un numérique !"
     * )
     */
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    private $amount;

    // Remplacement de @Assert\DateTime par @Assert\Type("\DateTimeInterface", message="La date doit être au format YYYY-MM-DD")
    /**
     * @ORM\Column(type="datetime")
     * @Assert\Type("\DateTimeInterface", message="La date doit être au format YYYY-MM-DD")
     * @Assert\NotBlank(message="La date d'envoi doit être renseignée")
     */
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le statut de la facture doit être obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Le statut doit être SENT, PAID ou CANCELLED")
     */
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank(message="Le client de la facture doit être renseigné")
     */
    #[Groups(["invoices_read"])]
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message="Il faut absolument un chrono pour la facture")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    private $chrono;

    /**
     * Permet de récupérer le User à qui appartient finalement la facture
     *  @Groups({"invoices_read", "invoices_subresource"})
     * @return User
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    // suppression de float avant $amount afin de forcer le validator au niveau de l'api
    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    // suppression de int avant $chrono afin de forcer le validator au niveau de l'api
    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
