import React, { useState, useContext } from 'react';
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import authAPI from '../services/authAPI';

const LoginPage = (props) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    // console.log(history);
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");


    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget;
        // const value = event.currentTarget.value;
        // const name = event.currentTarget.name;
        setCredentials({...credentials, [name]: value});
    }

    // Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await authAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            navigate("/customers")
        } catch (error) {
            setError(
                "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !"
            );
        }

        // console.log(credentials);
    }

    return ( 
        <>
        <h1>Connexion à l'application</h1>

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username" className="form-label mt-4">Adresse email</label>
                <input 
                    value={credentials.username}
                    onChange={handleChange}
                    type="email" 
                    placeholder='Adresse email de connexion' 
                    name='username' 
                    id='username' 
                    className={"form-control" + (error && " is-invalid")}
                />
                {error && <p className="invalid-feedback">
                   {error}
                </p>}
            </div>
            <div className="form-group">
                <label htmlFor="password" className="form-label mt-4">Mot de passe</label>
                <input 
                    value={credentials.password}
                    onChange={handleChange}
                    type="password" 
                    placeholder='Mot de passe' 
                    name='password' 
                    id='password' 
                    className="form-control" 
                />
            </div>
            <div className="form-group mt-4">
                <button type="submit" className="btn btn-success">
                    Je me connecte
                </button>
            </div>
        </form>
        </>
     );
}
 
export default LoginPage;