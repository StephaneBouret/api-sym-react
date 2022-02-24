import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import tokenAPI from '../services/tokenAPI';

const ForgetPassword = () => {

    const [credentials, setCredentials] = useState({
        username: ""
    });
    const [error, setError] = useState("");

    const disabled = credentials.username === "";

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget;
        // const value = event.currentTarget.value;
        // const name = event.currentTarget.name;
        setCredentials({...credentials, [name]: value});
    }

    const handleSubmit = async event => {
        event.preventDefault();
        // console.log(credentials);
        const email = credentials.username;
        try {
            const user = await tokenAPI.find(email);
            if (user) {
                const id = user.id;
                const forget = await tokenAPI.create(id);
                toast.success("Un email de réinitialisation a été envoyé à votre adresse !");
                // console.log(forget);
            } else {
                setError(true);
                toast.error("Cette adresse email est inconnue !");
            }
            
        } catch (error) {
            console.log(error.response.data);
        }
    }
    return ( 

        <>
            <h1>Mot de passe oublié</h1>

            <form onSubmit={handleSubmit}>
            <Field
                label="Adresse email"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Adresse email de connexion"
            />
            <div className="form-group mt-4">
                <button type="submit" className="btn btn-success" disabled={disabled}>
                    Changer mon mot de passe
                </button>
                <Link to="/login" className="btn btn-link">
                    Déjà inscrit ? Connectez-vous.
                </Link>
            </div>
        </form>
        </>
     );
}
 
export default ForgetPassword;