// Les imports importants
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';
// start the Stimulus application
import './bootstrap';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';
import CustomerPage from './pages/CustomerPage';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthAPI from './services/authAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';



// console.log("Hello World !!!");

AuthAPI.setup();

// const PrivateRoute = () => {
//     const { isAuthenticated } = useContext(AuthContext);
//     return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

const App = () => {
    // TODO : il faudrait par défaut que l'on demande à notre AuthAPI si on est connecté ou pas 
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated
            }}
        >
            <HashRouter>
            <Navbar />
            <main className="container pt-5">
                <Routes>
                    <Route 
                        path='/login' 
                        element={<LoginPage />} 
                    />
                    <Route 
                        path='/register' 
                        element={<RegisterPage />} 
                    />
                    {/* <Route path="/invoices" element={<InvoicesPage />} />
                    <Route path="/customers" element={<CustomersPage />} /> */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/invoices/:id" element={<InvoicePage />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/invoices" element={<InvoicesPage />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/customers/:id" element={<CustomerPage />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/customers" element={<CustomersPage />} />
                    </Route>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
        </HashRouter>
        <ToastContainer 
            position={toast.POSITION.BOTTOM_LEFT}
        />
    </AuthContext.Provider>
    );
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);