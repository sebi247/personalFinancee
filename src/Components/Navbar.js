import React, { useState, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import './Navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const navigateTo = (url) => {
    setActiveItem(url);
    navigate(url);
  };

  const items = [
    {label: 'Profile', icon: 'pi pi-user', command: () => navigateTo('/profile'), active: activeItem === '/profile',},
    {label: 'Income Management', icon: 'pi pi-money-bill', command: () => navigateTo('/income'), active: activeItem === '/income',},
    {label: 'Expense Management', icon: 'pi pi-credit-card', command: () => navigateTo('/expense'), active: activeItem === '/expense',},
    {label: 'Investment Management', icon: 'pi pi-briefcase', command: () => navigateTo('/investment'), active: activeItem === '/investment',},
    {label: 'Monthly Summary',  icon: 'pi pi-home',  command: () => navigateTo('/dashboard'),  active: activeItem === '/dashboard',},
  ];

  const start = (
    <div className="logo-container">
      <img src={require('./logo.png')} alt="logo" className='logo' />
      <h1>PersonalFinance</h1>
    </div>
  );

  return (
    <div className="navbar-container">
      <Menubar model={items} className="my-menubar" start={start} />
    </div>
  );
}
