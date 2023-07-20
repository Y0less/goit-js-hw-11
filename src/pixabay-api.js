import axios from 'axios';

const API_KEY = '38336258-d9d03668c91002861994a0a47';
const BASE_URL = 'https://pixabay.com/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
});

const searchParams = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: '40',
};

export default async function getImages(searchQuery, page) {
  const { key, image_type, orientation, safesearch, per_page } = searchParams;
  try {
    const response = await axiosInstance.get(
      `?key=${key}&q=${searchQuery}&page=${page}&per_page=${per_page}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
