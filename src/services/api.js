import axios from 'axios';

const api = axios.create(
    {
        baseURL:'https://localhost:3001/address/'
        /* baseURL:'https://swapi.co/api/' */
    }
);

export default api;