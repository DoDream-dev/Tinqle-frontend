import Config from 'react-native-config';
import { DevSettings } from 'react-native';
import { useAppDispatch } from '../store';
import EncryptedStorage from 'react-native-encrypted-storage';
import { setToken } from '../slices/user';
import axios from 'axios';
import store from '../store/index.ts';
import userSlice from '../slices/user';


const useAxiosInterceptor = () => {
  const dispatch = useAppDispatch();

  axios.interceptors.request.use(
    (config) => {
    const accessToken = store.getState().user.accessToken;
    
    config.headers['Content-Type'] = 'application/json';
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    console.log(error.data);
    return Promise.reject(error);
  });

  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error) => {
      if (error.response?.data.statusCode === 1000) {
        try {
          console.log('access denied')
          const refreshToken = await EncryptedStorage.getItem('refreshToken');
          if (!refreshToken) {DevSettings.reload(); console.log('reload');}
          const resp = await axios.post(`${Config.API_URL}/auth/reissue`, {refreshToken:refreshToken},);
          await dispatch(
            userSlice.actions.setToken({
              accessToken: resp.data.data.accessToken,
            }),
          );
          await EncryptedStorage.setItem('refreshToken', resp.data.data.refreshToken,);
          console.log('Token 재발급');
    
          const accessToken = resp.data.data.accessToken;
    
          error.config.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          };
    
          const response = await axios.request(error.config);
          return response;
        } catch (error2) {
          console.log(error2)
          const douleErrorResponseStatusCode = error2.response?.data.statusCode;
          if (douleErrorResponseStatusCode == 1070 || douleErrorResponseStatusCode == 1080 || douleErrorResponseStatusCode == 1060) {
            await EncryptedStorage.removeItem('refreshToken');
            DevSettings.reload();
            console.log('reload');
            return false;
          }
  
          return Promise.reject(error2);
        }
      }  
      return Promise.reject(error);
    }
  );
  return null;
};
export default useAxiosInterceptor;