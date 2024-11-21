// src/App.js
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { login, callStoredProcedure } from './dreamFactoryService';


const API_USER=process.env.REACT_APP_API_USER
const API_PW=process.env.REACT_APP_API_PW

const App = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                setError(null);

                // Authenticate and get session token
                const sessionToken = await login(API_USER, API_PW);

                // Fetch data using the stored procedure
                const params = [
                    {'name':'_member_id','value':'8-000027-04193711806002'},
                    {'name':'_period','value':'curr'}
                ]
                const procedureData = await callStoredProcedure('SP-WP-get_member_transaction_history_period', params, sessionToken);

                // Update the state with the fetched data
                setData(procedureData);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    // Define columns for the DataTable
    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>User Details</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    highlightOnHover
                    striped
                />
            )}
        </div>
    );
};

export default App;