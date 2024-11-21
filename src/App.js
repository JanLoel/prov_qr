// src/App.js
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { login, callStoredProcedure } from './dreamFactoryService';


const API_USER=process.env.REACT_APP_API_USER
const API_PW=process.env.REACT_APP_API_PW

const App = () => {
    const [data, setData] = useState([]); // Original data
    const [filteredData, setFilteredData] = useState([]); // Filtered data for search
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Search input state

    // Function to format column names: Replace underscores with spaces and capitalize each word
    const formatColumnName = (key) => {
        return key
            .split('_') // Split by underscores
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' '); // Join with spaces
    };

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

                // Set the dynamic columns based on the keys of the first object in the data
                if (procedureData.length > 0) {
                    const dynamicColumns = Object.keys(procedureData[0]).map((key) => ({
                        name: formatColumnName(key), // Format the column name
                        selector: (row) => row[key],
                        sortable: true,
                    }));
                    setColumns(dynamicColumns);
                }


                // Update the state with the fetched data
                setData(procedureData);
                setFilteredData(procedureData); // Initialize filteredData with full data
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    // Handle search input
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredData(data); // Reset to full data when search is cleared
        } else {
            const lowerCasedTerm = searchTerm.toLowerCase();
            const filtered = data.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(lowerCasedTerm)
                )
            );
            setFilteredData(filtered);
        }
    }, [searchTerm, data]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Transaction History</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            marginBottom: '20px',
                            padding: '10px',
                            fontSize: '16px',
                        }}
                    />

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        highlightOnHover
                        striped
                    />
                </>
            )}
        </div>
    );
};

export default App;