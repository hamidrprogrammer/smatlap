import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

 const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
        
      return token;
    }
  } catch (error) {
      
    return null
  }
};
const api = axios.create({
  baseURL: 'https://club.mamakschool.ir/club.backend/SmartClubApp', // Your API's base URL
  timeout: 10000, // 10 seconds timeout
});

// Add an interceptor to set the Authorization header
api.interceptors.request.use(async config => {
  try {
    const token = await getToken(); // Ensure getToken is a promise
    if (token && token.length > 15) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error fetching token:', error);
  }

  config.headers['Content-Type'] = 'multipart/form-data';
  return config;
}, error => {
  return Promise.reject(error);
});


const apiNews = axios.create({
  baseURL: 'https://prod-api.foxsports.com/', // Replace with your API's base URL

});
// Add an interceptor to set the Authorization header

  
export default {
  apiNews,
  api
};
