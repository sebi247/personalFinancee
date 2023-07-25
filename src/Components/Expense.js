import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import "./expense.css"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';


const ExpenseList = () => {
    const { userId } = useContext(AuthContext)
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        amount: '',
        category: '',
        date: '',
    });  
    
    const handleInputChange = (event) => {
        setNewExpense({...newExpense, [event.target.name]: event.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('https://personalfinanceapp1.azurewebsites.net/expenses',{
            amount: newExpense.amount,
            category: newExpense.category,
            userid: userId
        })
        .then(response =>{
            if(response.status === 200){
                let newExpenseFromResponse = {
                    ...response.data,
                    date: new Date(response.data.date)
                };
                setExpenses(prevExpenses => {
                    const updatedExpenses = [...prevExpenses];
                    updatedExpenses.unshift(newExpenseFromResponse);
                    return updatedExpenses;
                });
                setShowForm(false);
            }
        })
    }

    useEffect(() =>{
        if(userId) {
            axios.get(`http://localhost:8080/expenses/user/${userId}`)
                .then(response => {
                    if(response.status === 200){
                        const sortedExpenses = response.data.map(expense => ({
                            ...expense,
                            date: new Date(expense.date)
                        })).sort((a, b) => {
                            const dateComparison = b.date - a.date;
                            if(dateComparison !== 0) return dateComparison;

                            return b.id - a.id;
                        });
                    
                        setExpenses(sortedExpenses);
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, [userId]);
    

    const renderForm = () => (
        <Dialog 
            header="Add Expense" 
            visible={showForm} 
            style={{ width: '30vw', minHeight: '40vh', display: 'flex', justifyContent: 'center' }} 
            onHide={() => setShowForm(false)}
            contentStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="amount" className="p-d-block">Amount:</label>
                        <InputNumber id="amount" name="amount" value={newExpense.amount} onChange={(e) => handleInputChange({ target: { name: 'amount', value: e.value } })} required />
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="category" className="p-d-block">Source:</label>
                        <InputText id="category" name="category" value={newExpense.category} onChange={handleInputChange} required />
                    </div>
                </div>
                <Button label="Add expense" type="submit" className="p-button" onClick={handleSubmit} />
            </form>
        </Dialog>
    )

    return (
        <div className="parent">
            <div className="table-container">
            <DataTable value={expenses} className="full-screen-table">
                <Column 
                    field="date" 
                    header="Date"
                    body={rowData => rowData.date.toLocaleDateString()}
                ></Column>
                <Column field="category" header="Category"></Column>
                <Column field="amount" header="Amount"></Column>
            </DataTable>
            </div>
            <Button label="Add expense" className='p-button' onClick={() => setShowForm(true)} />
            {renderForm()}
        </div>
    )
}

export default ExpenseList