import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import tokenAPI from '../services/tokenAPI';
import usersAPI from '../services/usersAPI';

const ResetPassword = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { token = "" } = params;
    // console.log(token);

    const [user, setUser] = useState({
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        password: "",
        passwordConfirm: ""
    });

    const [editing, setEditing] = useState(false);

    const [id, setId] = useState({
        id: ""
    })

    // Récupération du token en fonction de l'url
    const fetchToken = async token => {
        try {
            const data = await tokenAPI.check(token);
            
            const { id } = data;
            setId({ id });
            if (data === false) {
                toast.error("Votre demande de mot de passe a expiré ou est erronée. Merci de la renouveller.");
                navigate("/forgetpassword");
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
      if (token !=="") {
          setEditing(true);
          fetchToken(token);
      }
    }, [token]);  

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    // Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();
        const currentId = id.id;
        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm =
                "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
            return;
        }
        try {
            setErrors({});

            if (editing) {
                const response = await usersAPI.update(currentId, user);
                toast.success("Votre mot de passe a bien été mis à jour !");
                navigate("/login");             
            }
        } catch (error) {
            // console.log(error.response);
            const { violations } = error.response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire !");
            }
        }
    }

    return ( 
        <>
            <h1>Réinitialiser mon mot de passe</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre nouveau mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field 
                    name="passwordConfirm"
                    label="Confirmation de mot de passe"
                    type="password"
                    placeholder="Confirmez votre nouveau mot de passe"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-success">
                        Réinitialiser
                    </button>
                </div>
            </form>
        </>
     );
}
 
export default ResetPassword;