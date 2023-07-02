import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import "./income.css"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

const IncomeList = () => {
    const { userId } = useContext(AuthContext);
    const [incomes, setIncomes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newIncome, setNewIncome] = useState({
        amount: '',
        source: '',
        date: '',
    });

    useEffect(() =>{
        if(userId) {
            axios.get(`http://localhost:8080/incomes/user/${userId}`)
                .then(response => {
                    if(response.status === 200){
                        const sortedIncomes = response.data.map(income => ({
                            ...income,
                            date: new Date(income.date)
                        })).sort((a, b) => {
                            const dateComparison = b.date - a.date;
                            if(dateComparison !== 0) return dateComparison;
                            return b.id - a.id;
                        });
                    
                        setIncomes(sortedIncomes);
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, [userId]);
    

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/incomes', { 
            amount: newIncome.amount,
            source: newIncome.source,
            userid: userId
        })
        .then(response =>{
            if(response.status === 200){
                let newIncomeFromResponse = {
                    ...response.data,
                    date: new Date(response.data.date)
                };
                setIncomes(prevIncomes => {
                    const updatedIncomes = [...prevIncomes];
                    updatedIncomes.unshift(newIncomeFromResponse);
                    return updatedIncomes;
                });
                setShowForm(false);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const handleInputChange = (event) => {
        setNewIncome({ ...newIncome, [event.target.name]: event.target.value });
    }
    

    const renderForm = () => (
        <Dialog 
            header="Add Income" 
            visible={showForm} 
            style={{ width: '30vw', minHeight: '40vh', display: 'flex', justifyContent: 'center' }} 
            onHide={() => setShowForm(false)}
            contentStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="amount" className="p-d-block">Amount:</label>
                        <InputNumber id="amount" name="amount" value={newIncome.amount} onChange={(e) => handleInputChange({ target: { name: 'amount', value: e.value } })} required />
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="source" className="p-d-block">Source:</label>
                        <InputText id="source" name="source" value={newIncome.source} onChange={handleInputChange} required />
                    </div>
                </div>
                <Button label="Add income" type="submit" className="p-button" onClick={handleSubmit} />
            </form>
        </Dialog>
    )
    
    return (
        <div className="parent">
            <div className="table-container">
            <DataTable value={incomes} className="full-screen-table">
                <Column 
                    field="date" 
                    header="Date"
                    body={rowData => rowData.date.toLocaleDateString()}
                ></Column>
                <Column field="source" header="Source"></Column>
                <Column field="amount" header="Amount"></Column>
            </DataTable>
            </div>
            <Button label="Add income" className='p-button' onClick={() => setShowForm(true)} />
            {renderForm()}
        </div>
    )
}

export default IncomeList;
