import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.input');
const btnSearch = document.querySelector('.button');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

btnLoadMore.style.display = 'none';
let page = 1;

btnSearch.addEventListener('click', async e => {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    try {
      const searchData = await fetchImages(input.value, page);
      if (searchData.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createCards(searchData.hits);
        btnLoadMore.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  }
});

async function createCards(imgs) {
  console.log(imgs);
  const markup = imgs
    .map(img => {
      return `<a class="gallery__link" href="${img.largeImageURL}">
        <div class="gallery-item">
          <img class="gallery-item__img" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes: </b>${img.likes}
            </p>
            <p class="info-item">
              <b>Views: </b>${img.views}
            </p>
            <p class="info-item">
              <b>Comments: </b>${img.comments}
            </p>
            <p class="info-item">
              <b>Downloads: </b>${img.downloads}
            </p>
          </div>
        </div>
      </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  gallerySimpleLightbox.refresh();
}

btnLoadMore.addEventListener('click', async () => {
  page += 1;
  btnLoadMore.style.display = 'none';
  try {
    const searchData = await fetchImages(input.value, page);
    if (searchData.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createCards(searchData.hits);
      if (
        gallery.querySelectorAll('.gallery__link').length >=
        searchData.totalHits
      ) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        btnLoadMore.style.display = 'none';
      } else {
        btnLoadMore.style.display = 'block';
      }
      gallerySimpleLightbox.destroy();
      gallerySimpleLightbox = new SimpleLightbox('.gallery a');
    }
  } catch (error) {
    console.error(error);
  }
});

function cleanGallery() {
  gallery.innerHTML = '';
  page = 1;
  btnLoadMore.style.display = 'none';
}
