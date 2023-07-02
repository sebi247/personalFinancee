import React, { useEffect, useState, useContext } from 'react';
import { Card } from 'primereact/card';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Button } from 'primereact/button';

export default function Dashboard() {
    const { userId } = useContext(AuthContext);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalInvestments, setTotalInvestments] = useState(0);

    useEffect(() => {
        if(userId) {
            axios.get(`http://localhost:8080/reports/user/${userId}/monthly`)
                .then(response => {
                    if(response.status === 200){
                        setTotalIncome(response.data.totalIncome);
                        setTotalExpenses(response.data.totalExpenses);
                        setTotalInvestments(response.data.totalInvestments);
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, [userId]);

    const handlePdfDownload = () => {
        window.open(`http://localhost:8080/reports/user/${userId}/monthly/pdf`);
    };

    const incomeCard = (
        <Card title="Total Income">
            <h2>{totalIncome}</h2>
        </Card>
    );

    const expensesCard = (
        <Card title="Total Expenses">
            <h2>{totalExpenses}</h2>
        </Card>
    );

    const investmentsCard = (
        <Card title="Total Investments">
            <h2>{totalInvestments}</h2>
        </Card>
    );

    const netIncomeCard = (
        <Card title="Net Income">
            <h2>{totalIncome - totalExpenses - totalInvestments}</h2>
        </Card>
    );

    return (
        <div>
            <h1>This is your Monthly Summary: </h1>
            {incomeCard}
            {expensesCard}
            {investmentsCard}
            {netIncomeCard}

            <Button label="Download PDF Report" onClick={handlePdfDownload} />
        </div>
    )
}
