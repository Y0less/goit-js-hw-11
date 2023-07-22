import getImages from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let page = null;
let searchQuery = '';
let totalHits = null;

refs.searchForm.addEventListener('submit', handleSubmit);
refs.loadMore.addEventListener('click', handleLoadmore);

function handleSubmit(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  searchQuery = '';
  page = 1;
  hideLoadMore();
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  console.log('searchQuery :>> ', searchQuery); //hide

  getImages(searchQuery, page)
    .then(data => {
      totalHits = data.totalHits;
      if (!totalHits) {
        notifyFailure();
        hideLoadMore();
        return;
      }
      console.log(data); //hide
      notifySuccess(totalHits);
      generateMarkup(data);
      showLoadMore();
    })
    .catch(error => {
      console.log(error);
      hideLoadMore();
    })
    .finally();
}

function handleLoadmore() {
  page += 1;
  getImages(searchQuery, page)
    .then(data => {
      if (!data.totalHits) {
        notifyFailure();
        hideLoadMore();
        return;
      }
      console.log(data); //hide
      generateMarkup(data);
      showLoadMore();
    })
    .catch(error => {
      console.log(error);
      hideLoadMore();
    })
    .finally();
}

function generateMarkup(data = []) {
  const markup = data.hits
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

function showLoadMore() {
  refs.loadMore.classList.remove('is-hidden');
}
function hideLoadMore() {
  refs.loadMore.classList.add('is-hidden');
}

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifySuccess(matches) {
  Notify.success(`${matches} matches found!`);
}

//temporary
// getImages('cat').then(data => generateMarkup(data));

// showLoadMore();
