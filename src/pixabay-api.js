import axios from 'axios';
import { searchParams } from './index.js';

const API_KEY = '38336258-d9d03668c91002861994a0a47';
const BASE_URL = 'https://pixabay.com/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
});

export default async function getImages(searchQuery) {
  const { image_type, orientation, safesearch, per_page, page } = searchParams;
  // try {
  const response = await axiosInstance.get(
    `?key=${API_KEY}&q=${searchQuery}&page=${page}&per_page=${per_page}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`
  );
  // console.log(response);
  return response.data;
  // } catch (error) {
  //   console.error(error);
  //   return error;
  // }
}
