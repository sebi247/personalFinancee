// LoginForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './classes.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const LoginForm = () => {
    const { setUserId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('https://personalfinanceapp1.azurewebsites.net/users/login', credentials)
            .then(response => {
                console.log(response.data);
                if (response.status === 200) {
                    setUserId(response.data.id);
                    navigate('/incomes');
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const handleRegister = () => {
        navigate('/Register'); 
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>Email:</label>
                    <InputText id="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Password:</label>
                    <Password id="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>
                <div className='buttons flex-buttons'>
                    <Button label="Log In" type="submit" className="p-button" />
                    <Button label="Register" type="button" className="p-button" onClick={handleRegister} />
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
