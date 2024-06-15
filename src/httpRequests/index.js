import axios from "axios";

const $host = axios.create({
    baseURL: 'https://backend.sad-hamster.com.pl/'
})
// https://backend.dragoneggs.net.pl/
// http://test.server195361.nazwa.pl/
// https://drag-back.onrender.com
// https://backend.dragoneggs.site/
// http://localhost:8000

export {$host}
