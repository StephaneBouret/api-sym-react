import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = (props) => {
    
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    // Création d'un state pour la pagination (page par vdéfaut 1)
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;
    
    // Au chargement du composant, on va chercher les customers
    useEffect(() => {
        axios
            .get(`https://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch(error => console.log(error.response));
    }, [currentPage])

    // Gestion de la suppression d'un customer
    const handleDelete = id => {
        // console.log(id);

        // Copie du tableau des customers avant la suppression
        const originalCustomers = [...customers];

        // 1. L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));
        // 2. L'approche pessimiste
        axios
            .delete("https://127.0.0.1:8000/api/customers/" + id)
            .then(response => console.log("OK"))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
    };

    // Gestion du changement de page
    const handlePageChange = page => {
        setCurrentPage(page);
        setLoading(true);
    }


    // DEPLACEMENT VERS PAGINATION.JSX
    // // D'où on part (start) pendant combien (itemsPerPage)
    // const start = currentPage * itemsPerPage - itemsPerPage;
    // //            4           * 10           - 10 = 30
    // const paginatedCustomers = customers.slice(start, start + itemsPerPage);
    // // console.log(pages);
    const paginatedCustomers = Pagination.getData(
        customers, 
        currentPage, 
        itemsPerPage
    );

    return ( 
    <>
    <h1>Liste des clients (pagination)</h1>

    <table className="table table-hover">
        <thead>
            <tr>
                <th>Id.</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th className='text-center'>Factures</th>
                <th className='text-center'>Montant total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {loading && (
                <tr>
                    <td>Chargement ...</td>
                </tr>
            )}
            {!loading && 
            customers.map(customer => <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                    <a href="#">{customer.firstName} {customer.lastName}</a>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className='text-center'>
                    <span className="badge bg-primary">{customer.invoices.length}</span>
                </td>
                <td className='text-center'>
                    {customer.totalAmount.toLocaleString()} €
                </td>
                <td>
                    <button 
                    onClick={() => handleDelete(customer.id)}
                    className="btn btn-sm btn-danger"
                    disabled={customer.invoices.length > 0}
                    >Supprimer</button>
                </td>
            </tr>)}
        </tbody>
    </table>

    <Pagination 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={totalItems} 
        onPageChanged={handlePageChange} />
    </> 
    );
}
 
export default CustomersPageWithPagination;