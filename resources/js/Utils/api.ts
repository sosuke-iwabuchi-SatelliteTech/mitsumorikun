import axios from 'axios';

const api = axios.create({
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

export default api;
