import axios from "axios";


const API_BASE_URL = 'http://localhost:8080';
//const API_BASE_URL = 'https://apisensoresback.duckdns.org';


export const taskApi = {

    getAllSensors: async () => {
        const response = await axios.get(`${API_BASE_URL}/sensors`);
        return response.data;
    },

    updateSensorState: async (id, state) => {
        const response = await axios.put(`${API_BASE_URL}/sensors/${id}`, { state });
        return response.data;
    },

    getAllLectures: async () => {
        const response = await axios.get(`${API_BASE_URL}/lectures`);
        return response.data;
    },

    getLecturesByDateRange: async (sensorId, inicio, fin) => {
        const response = await axios.get(
            `${API_BASE_URL}/lectures/sensor/${sensorId}`,
            { params: { inicio, fin } }
        );
        return response.data;
    }






};
