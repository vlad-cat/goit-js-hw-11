import axios from 'axios';

export const fetchImages = async (inputValue, pageNr) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=36111382-22a83a14602283ad176c86834&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${pageNr}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
