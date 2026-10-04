import axios from 'axios';
import { baseUrl } from '../constants';

export const refresh = async () => {
  return axios.post(`${baseUrl}/api/v1/users/refresh`);
};
