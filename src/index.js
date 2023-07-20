import getImages from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let page = 1;

refs.searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  if (!refs.loadMore.classList.contains('is-hidden')) {
    toggleLoadMore();
  }
  const searchQuery = evt.currentTarget.elements.searchQuery.value;
  console.log('searchQuery :>> ', searchQuery); //hide
  getImages(searchQuery, page)
    .then(data => {
      if (!data.totalHits) {
        notifyFailure();
        toggleLoadMore();
      }
      console.log(data), //hide
        generateMarkup(data);
      //   toggleLoadMore();
    })
    .catch(error => console.log(error))
    .finally(toggleLoadMore);
  //   page += 1;
}

function generateMarkup(data = []) {
  markup = data.hits
    .map(
      (
        {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        } = data.hits
      ) =>
        `
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item"><b>Likes</b><br />${likes}</p>
    <p class="info-item"><b>Views </b><br />${views}</p>
    <p class="info-item"><b>Comments </b><br />${comments}</p>
    <p class="info-item"><b>Downloads </b><br />${downloads}</p>
  </div>
</div>
`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function toggleLoadMore() {
  refs.loadMore.classList.toggle('is-hidden');
}

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

//temporary
// getImages('cat').then(data => generateMarkup(data));
