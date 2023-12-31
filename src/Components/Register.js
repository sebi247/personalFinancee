import React, { useState, useRef } from 'react';
import axios from 'axios';
import './classes.css';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

const UserForm = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: '',
        name: '',
        dateOfBirth: '',
        phoneNumber: '',
    });

    const [mask, setMask] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const toast = useRef(null);


    const countryCodes = [
        {name: 'UK', code: '+44', mask: '99999 999999'},
        {name: 'RO', code: '+40', mask: '9999 999 999'}
    ];

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }

    const handleCountryChange = (event) => {
        setSelectedCountry(event.value);
        setMask(event.value.mask);
    }

    const handleSubmit = (event) => {
    event.preventDefault();
    const userWithFullPhoneNumber = {
        ...user,
        phoneNumber: `${selectedCountry.code}${user.phoneNumber.replace(/\s+/g, '')}`, 
    };
    axios.post('https://personalfinanceapp1.azurewebsites.net/users', userWithFullPhoneNumber)
        .then(response => {
            console.log(response.data);
            if (response.status === 200) {
                navigate('/login');
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
            if (error && error.response) {
                console.error('Error status code:', error.response.status);
                if (error.response.status === 400) {
                    toast.current.show({severity: 'warn', summary: 'Warn Message', detail: 'User with this email is already registered.'});
                } else {
                    toast.current.show({severity: 'warn', summary: 'Warn Message', detail: 'An unknown error occurred'});
                }
            }
        });
    }

    

    const handleLogin = () => {
        navigate('/Login'); 
    }


 

    return (
        <div className="form-container">
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>Email:</label>
                    <InputText id="email" name="email" value={user.email} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Password:</label>
                    <Password id="password" name="password" value={user.password} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Name:</label>
                    <InputText id="name" name="name" value={user.name} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>Date of Birth:</label>
                    <Calendar id="dateOfBirth" name="dateOfBirth" value={user.dateOfBirth} onChange={handleChange} required showIcon />
                </div>
                <div className="form-field">
                    <label>Country Code:</label>
                    <Dropdown id="countryCode" name="countryCode" value={selectedCountry} options={countryCodes} optionLabel={(option) => `${option.name} (${option.code})`} onChange={handleCountryChange} placeholder="Select a Country Code" />
                </div>
                <div className="form-field">
                    <label>Phone Number:</label>
                    <InputMask id="phoneNumber" name="phoneNumber" mask={mask} value={user.phoneNumber} onChange={handleChange} required />
                </div>
                <div className='buttons'>
                    <Button label="Create User" type="submit" className="p-button" />
                    <Button label="Log in" type="button" className="p-button" onClick={handleLogin} />
                </div>
            </form>
        </div>
    );
}

export default UserForm;
