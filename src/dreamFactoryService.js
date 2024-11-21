// src/dreamFactoryService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_DF_API_URL;
const API_KEY = process.env.REACT_APP_DF_API_KEY;
const DB_NAME = process.env.REACT_APP_DB_NAME;


// Function to log in and retrieve a session token
export const login = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/user/session`,
            { email, password },
            {
                headers: {
                    'X-DreamFactory-API-Key': API_KEY,
                },
            }
        );
        console.log('Session Token:', response.data.session_token);
        return response.data.session_token;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};


export const callStoredProcedure = async (sp,params,token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/${DB_NAME}/_proc/${sp}`,
            {
                params
            }, // Pass parameters here
            {
                headers: {
                    'X-DreamFactory-API-Key': API_KEY,
                    'X-DreamFactory-Session-Token': token, // Include session token
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Stored Procedure Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error calling stored procedure:', error);
        throw error;
    }
};

/*

const email = 'johnloelpadrilan@gmail.com';
const password = '13123123A';

login(email, password).then((token) => {
    callStoredProcedure('SP-WP-get_member_transaction_history_period',params,token).then(data => {
        console.log(data);
    });
});
*/


const params = [
    {'name':'_member_id','value':'8-000027-04193711806002'},
    {'name':'_period','value':'curr'}
]

// Create an instance of axios with the base URL and headers
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-DreamFactory-API-Key': API_KEY,
        'Content-Type': 'application/json',
    },
});


// Example function to get data from a table
export const getTableData = async (tableName) => {
    try {
        const response = await api.get(`/${tableName}/_table`);
        return response.data.resource;
    } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        throw error;
    }
};

// Function to logout
export const logout = async () => {
    try {
        await api.delete('/user/session');
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};