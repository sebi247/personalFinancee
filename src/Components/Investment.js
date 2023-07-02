import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import "./investments.css"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

const InvestmentList = () => {
    const { userId } = useContext(AuthContext)
    const [investments, setInvestment] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [cashedOutInvestments, setCashedOutInvestments] = useState([]);
    const [newInvestment, setNewInvestment] = useState({
        amount: '',
        type: '',
        returns:'',
        date: '',
    });  

    const investmentTypes = ["Stocks", "Bonds", "Mutual Funds", "Real Estate", "ETFs", "Cryptocurrency"];
    const returnsOptions = ["0.01", "0.02", "0.03", "0.04", "0.05", "0.06", "0.07", "0.08", "0.09", "0.10"];


    const handleCashedOutChange = (investmentId) => {
        const updatedInvestment = investments.find(investment => investment.id === investmentId);
      
        if (updatedInvestment.cashedOut) {
          throw new Error("Investment has already been cashed out");
        }
      
        axios.post(`http://localhost:8080/investments/${userId}/cashOutInvestment/${investmentId}`)
          .then(response => {
            if (response.status === 200) {
              console.log('Investment cashed out successfully.');
              updatedInvestment.cashedOut = 1;
              setCashedOutInvestments(prevCashedOutInvestments => [...prevCashedOutInvestments, updatedInvestment]);
            }
          })
          .catch(error => {
            console.error('There was an error cashing out the investment!', error);
          });
      };
          


      useEffect(() => {
        if (userId) {
          axios.get(`http://localhost:8080/investments/user/${userId}`)
            .then(response => {
              if (response.status === 200) {
                const sortedInvestment = response.data.map(investment => ({
                  ...investment,
                  date: investment.date.toString()
                })).sort((a, b) => {
                  const dateComparison = new Date(b.date) - new Date(a.date);
                  if (dateComparison !== 0) return dateComparison;
                  return b.id - a.id;
                });
      
                setInvestment(sortedInvestment);
                setCashedOutInvestments(sortedInvestment.filter(investment => investment.cashedOut));
              }
            })
            .catch(error => {
              console.error('There was an error!', error);
            });
        }
      }, [userId]);
      


    const handleInputChange = (event) => {
        setNewInvestment({ ...newInvestment, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/investments', { 
            amount: newInvestment.amount,
            type: newInvestment.type,
            returns: newInvestment.returns,
            userid: userId
        })
        .then(response =>{
            if(response.status === 200){
                let newInvestmentFromResponse = {
                    ...response.data,
                    date: new Date(response.data.date).toLocaleDateString()
                };
                setInvestment(prevInvestment => {
                    const updatedInvestments = [...prevInvestment];
                    updatedInvestments.unshift(newInvestmentFromResponse);
                    return updatedInvestments;
                });
                setShowForm(false);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }


    const renderForm = () => (
        <Dialog 
            header="Add Investment" 
            visible={showForm} 
            style={{ width: '30vw', minHeight: '40vh', display: 'flex', justifyContent: 'center' }} 
            onHide={() => setShowForm(false)}
            contentStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="amount" className="p-d-block">Amount:</label>
                        <InputNumber id="amount" name="amount" value={newInvestment.amount} onChange={(e) => handleInputChange({ target: { name: 'amount', value: e.value } })} required />
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="type" className="p-d-block">Type:</label>
                        <Dropdown id="type" name="type" value={newInvestment.type} options={investmentTypes} onChange={(e) => handleInputChange({ target: { name: 'type', value: e.value } })} required />
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="returns" className="p-d-block">Returns:</label>
                        <Dropdown id="returns" name="returns" value={newInvestment.returns} options={returnsOptions} onChange={(e) => handleInputChange({ target: { name: 'returns', value: e.value } })} required />
                    </div>
                </div>
                <Button label="Add Investment" type="submit" className="p-button" onClick={handleSubmit} />
            </form>
        </Dialog>
    )
    
    return (
        <div className="parent">
            <div className="table-container">
            <DataTable value={investments} className="full-screen-table">
                <Column field="date" header="Date"></Column>
                <Column field="type" header="Type"></Column>
                <Column field="returns" header="Returns"></Column>
                <Column field="amount" header="Amount"></Column>
                <Column field="amountAfterReturns" header="Amount_after_returns" ></Column>
                <Column header="Cashed Out" body={(rowData) => (
                <input
                    type="checkbox"
                    checked={cashedOutInvestments.some(investment => investment.id === rowData.id)}
                    disabled={rowData.cashedOut}
                    onChange={() => handleCashedOutChange(rowData.id)}
                />
                )}></Column>
            </DataTable>
            </div>
            <Button label="Add Investment" className='p-button' onClick={() => setShowForm(true)} />
            {renderForm()}
        </div>
    )
    
}


export default InvestmentList;