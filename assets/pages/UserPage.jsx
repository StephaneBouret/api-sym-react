import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import usersAPI from '../services/usersAPI';

const UserPage = () => {

    const [user, setUser] = useState({
        lastName: "",
        firstName: "",
        email: ""
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: ""
    });

    const [editing, setEditing] = useState(true);

    const token = window.localStorage.getItem("authToken");
    const currentId = jwtDecode(token).id;
    // console.log(currentId);

    // Récupération du user
    const fetchUser = async id => {
        try {
            const { firstName, lastName, email } = await usersAPI.find(id);

            setUser({ firstName, lastName, email });
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        if (currentId) {
            setEditing(true);
            fetchUser(currentId);
        }
    }, [currentId])



    // Gestion des changements des inputs dans le formulaire
    function handleChange({ currentTarget }) {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    }

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();
        // console.log(user);
        try {
            setErrors({});

            if (editing) {
                const response = await usersAPI.update(currentId, user);
                toast.success("Vos modifications ont bien été prises en compte !")
                // console.log(response.data);
            }
        } catch (error) {
            const { violations } = error.response.data;
            console.log(error.response);
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                    // console.log(apiErrors);
                    setErrors(apiErrors);
                    toast.error("Des erreurs dans votre formulaire !");
                })
            }
        }
    }

    return ( 
        <>
            <h1>Modifier mon profil</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Mon prénom"
                    value={user.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field 
                    name="lastName"
                    label="Nom"
                    placeholder="Mon nom de famille"
                    value={user.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field 
                    name="email"
                    label="Email"
                    placeholder="Mon adresse email"
                    value={user.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-success">
                    Modifier
                    </button>
                <Link to="/" className="btn btn-link">
                    Retour
                </Link>
          </div>
            </form>
        </>
     );
}
 
export default UserPage;

