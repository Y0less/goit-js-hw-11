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
};

export default async function getImages(searchQuery) {
  const { key, image_type, orientation, safesearch } = searchParams;
  try {
    const response = await axiosInstance.get(
      `?key=${key}&q=${searchQuery}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
