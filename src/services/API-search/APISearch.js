import axios from 'axios';

export let requestedWord = '';
export let currentPage = 1;

export const fetchData = async (requestedWord, currentPage) => {
  const response = await axios.get(
    `https://pixabay.com/api/?key=39259694-dab3c4ff3451cd0969a895f6a&q=${requestedWord}`,
    {
      params: {
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
        per_page: 12,
        page: currentPage,
      },
    }
  );
  return response.data;
};
